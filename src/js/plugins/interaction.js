;(function($, Planner) { 'use strict';

    // Plugin constructor and defaults
    // -------------------------------

    var Crud = function(planner, options) {
        this.planner = planner;
        this.$element = planner.$element;
        this.options = options;

        // Used during card generation
        this.currentCard = null;
        this.currentElement = null;
        this.listReduced = [];
        this.initialIndex = null;
        this.initialY = null;
    };

    Crud.DEFAULTS = {
        dragComponent: '---'
    };

    // Plugin attach events
    // --------------------

    // Publish click event on Card DOM element
    Crud.prototype.attachClick = function() {
        Planner.Events.subscribe('cardDrawn', function(card, $element) {
            $element.on({
                mouseclick: function(event) {
                    Planner.Events.publish('cardClicked', [card, $element]);

                    // Avoid propagation of element on child/parent elements
                    event.stopPropagation();
                },
                mousedown: function(event) {
                    // Avoid propagation of element on child/parent elements
                    event.stopPropagation();
                }
            });
        });
    };

    Crud.prototype.attachDragCreation = function() {
        var self = this;

        self.$element.find('.planner-column > div').on({
            mousedown: function(event) {
                // Create a new card and draw DOM element
                var $this = $(this);
                var startAttribute = Planner.Helpers.indexToAttribute($this.index());
                var endAttribute = Planner.Helpers.indexToAttribute($this.index() + 1);
                var assignee = [$this.parent().index() + 1];
                var card = new Planner.Model.Card({start: startAttribute, end: endAttribute, assignees: assignee});
                card.drawCard();

                // Start interaction with created objects
                self._startInteraction(card, Planner.mapCard.get(card)[0], $this.index(), event.clientY);

                event.preventDefault();
            },
            mousemove: function(event) {
                if (self.currentCard !== null) {
                    self._resize(event.clientY);

                    event.preventDefault();
                }
            },
            mouseup: function(event) {
                self._stopInteraction();
                event.preventDefault();

                Planner.Events.publish('cardCreated', [self, self.currentElement]);
            }
        });
    };

    Crud.prototype.attachDragAndDrop = function() {
        var self = this;

        // Add jQuery event 'dataTransfer' property as
        // stated in: http://api.jquery.com/category/events/event-object/
        $.event.props.push('dataTransfer');

        // Happend drag events to timeslots
        self.$element.find('.planner-column > div').on({
            dragover:  function(event) {
                event.preventDefault();
            },
            drop: function() {
                self._drag(this);
                self._resetDrag();
                self._stopInteraction();

                Planner.Events.publish('cardUpdated', [self.currentCard, self.currentElement]);
            }
        });

        Planner.Events.subscribe('cardDrawn', function(card, $element) {
            $element.attr('draggable', true);
            $element.on({
                dragstart: function(event) {
                    // Start interaction with created objects
                    self._startInteraction(card, $element);

                    // Required for Firefox
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/html', '[Object] Card');

                    // Add a ghost effect
                    $element.addClass('dragging');
                },
                dragenter: function() {
                    // Reduce card size if draggedElement goes upfront another card
                    // and store the node to remove this effect later
                    if (!$element.hasClass('card-small')) {
                        $element.addClass('card-small');
                        self.listReduced.push($element);
                    }
                },
                drop: function(event) {
                    // Avoid to drop a card over another card
                    event.preventDefault();
                    event.stopPropagation();
                    self._resetDrag();
                },
                dragend: function() {
                    // Remove ghost effect
                    $element.removeClass('dragging');
                }
            });
        });
    };

    Crud.prototype.attachResize = function() {
        var self = this;

        Planner.Events.subscribe('cardDrawn', function(card, $element) {
            var draggableDom = $(Planner.Templates.drag({dragComponent: self.options.dragComponent}));
            $element.find('.planner-card-title').after(draggableDom);
        });
    };

    // Plugin helpers
    // --------------

    Crud.prototype._startInteraction = function(card, $element, initialIndex, initialY) {
        // Store variables for further interactions
        this.currentCard = card;
        this.currentElement = $element;
        this.initialIndex = initialIndex;
        this.initialY = initialY;
    };

    Crud.prototype._stopInteraction = function() {
        this.currentCard = null;
        this.currentElement = null;
        this.listReduced = [];
        this.initialIndex = null;
        this.initialY = null;
    };

    Crud.prototype._drag = function(destination) {
        var card = Planner.mapDom.get(this.currentElement);
        var length = this.currentElement.data('end') - this.currentElement.data('start');

        this.currentElement.appendTo(destination);
        var assignee = this.currentElement.parent().parent().index() + 1;
        var startPosition = this.currentElement.parent().index();

        // Update Card object
        card.assignees = [assignee];
        card.start = Planner.Helpers.indexToAttribute(startPosition);
        card.end = Planner.Helpers.indexToAttribute(startPosition + length);

        // Update DOM object
        card.titleHeader = card._generateTitle();
        this.currentElement.find('.planner-card-time').html(card.titleHeader);
        this.currentElement.data('start', startPosition);
        this.currentElement.data('end', startPosition + length);
        this.currentElement.data('column', assignee);

    };

    Crud.prototype._resize = function(pointerY) {
        var currentCardPosition = Math.floor((pointerY - this.initialY) / this.options.timeslotHeight) + 1;

        this.currentCard.end = Planner.Helpers.indexToAttribute(this.initialIndex + currentCardPosition);
        this.currentCard.titleHeader = this.currentCard._generateTitle();

        // Calculate new length
        var startIndex = Planner.Helpers.attributeToIndex(this.currentCard.start);
        var endIndex = Planner.Helpers.attributeToIndex(this.currentCard.end);
        var cardLength = (endIndex - startIndex) * this.options.timeslotHeight - this.options.cardTitleMargin;

        // Update DOM values
        this.currentElement.data('end', endIndex);
        this.currentElement.find('.planner-card-time').html(this.currentCard.titleHeader);
        this.currentElement.height(cardLength);
    };

    Crud.prototype._resetDrag = function() {
        while (this.listReduced.length > 0) {
            this.listReduced.pop().removeClass('card-small');
        }
    };

    // Crud plugin definition
    // ----------------------

    var old = $.fn.crud;

    $.fn.crud = function(option) {
        var planner = this;

        return this.$element.each(function() {
            var $this = $(this);
            var data = $this.data('pl.plugins.crud');
            var options = $.extend({}, Crud.DEFAULTS, $this.data('pl.planner').options, typeof option === 'object' && option);

            // If this node isn't initialized, call the constructor
            if (!data) {
                $this.data('pl.plugins.crud', (data = new Crud(planner, options)));
            }

            data.attachClick();
            data.attachDragCreation();
            data.attachDragAndDrop();
            data.attachResize();
        });
    };

    $.fn.crud.constructor = Crud;

    // Crud no conflict
    // ----------------

    $.fn.crud.noConflict = function() {
        $.fn.crud = old;
        return this;
    };

    // Register this plugin to plugins list
    // ------------------------------------

    Planner.Plugins.register('interaction', $.fn.crud);

})(jQuery, Planner);
