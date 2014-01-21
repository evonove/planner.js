;(function($, Planner) { 'use strict';

    // Plugin constructor and defaults
    // -------------------------------

    var Crud = function(planner, options) {
        this.planner = planner;
        this.$element = planner.$element;
        this.options = options;

        // Used during card generation
        this.currentCard = null;
        this.generatedDom = null;
        this.initialIndex = null;
        this.initialY = null;
    };

    Crud.DEFAULTS = {
        dragComponent: '---'
    };

    // Plugin functionalities
    // ----------------------

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
                // Start card creation
                var $this = $(this);
                var startAttribute = Planner.Helpers.indexToAttribute($this.index());
                var endAttribute = Planner.Helpers.indexToAttribute($this.index() + 1);
                var assignee = [$this.parent().index() + 1];

                // Create a Card object with relative DOM element
                self.currentCard = new Planner.Model.Card({start: startAttribute, end: endAttribute, assignees: assignee});
                self.currentCard.drawCard();

                // Store temporary values
                self.generatedDom = Planner.mapCard.get(self.currentCard)[0];
                self.initialIndex = $this.index();
                self.initialY = event.clientY;

                // Avoid other actions
                event.preventDefault();
            },
            mouseup: function(event) {
                // Propagate Card creation event
                Planner.Events.publish('cardCreated', [self, self.generatedDom]);

                // Reset temporary values
                self.currentCard = null;
                self.generatedDom = null;
                self.initialIndex = null;
                self.initialY = null;

                // Avoid other actions
                event.preventDefault();
            },
            mousemove: function(event) {
                if (self.currentCard !== null) {
                    var currentCardPosition = Math.floor((event.clientY - self.initialY) / self.options.timeslotHeight) + 1;

                    self.currentCard.end = Planner.Helpers.indexToAttribute(self.initialIndex + currentCardPosition);
                    self.currentCard.titleHeader = self.currentCard._generateTitle();

                    // Calculate new length
                    var startIndex = Planner.Helpers.attributeToIndex(self.currentCard.start);
                    var endIndex = Planner.Helpers.attributeToIndex(self.currentCard.end);
                    var cardLength = (endIndex - startIndex) * self.options.timeslotHeight - self.options.cardTitleMargin;

                    // Update DOM values
                    self.generatedDom.data('end', endIndex);
                    self.generatedDom.find('.planner-card-time').html(self.currentCard.titleHeader);
                    self.generatedDom.height(cardLength);

                    // Avoid other actions
                    event.preventDefault();
                }
            }
        });
    };

    Crud.prototype.attachDragAndDrop = function() {
        var self = this;
        var $draggedElement = null;
        var listReduced = [];

        /**
         * Reset all variables and classes to starting values
         */
        var resetDrag = function() {
            $draggedElement = null;
            listReduced.forEach(function(node) {
                node.removeClass('card-small');
            });

            listReduced = [];
        };

        // Add jQuery event 'dataTransfer' property as
        // stated in: http://api.jquery.com/category/events/event-object/
        $.event.props.push('dataTransfer');

        // Happend drag events to timeslots
        self.$element.find('.planner-column > div').on({
            dragover:  function(event) {
                // Needed otherwise drop will not work
                event.preventDefault();
            },
            drop: function() {
                var card = Planner.mapDom.get($draggedElement);
                var length = $draggedElement.data('end') - $draggedElement.data('start');

                $draggedElement.appendTo(this);
                var assignee = $draggedElement.parent().parent().index() + 1;
                var startPosition = $draggedElement.parent().index();

                // Update Card object
                card.assignees = [assignee];
                card.start = Planner.Helpers.indexToAttribute(startPosition);
                card.end = Planner.Helpers.indexToAttribute(startPosition + length);

                // Update DOM object
                card.titleHeader = card._generateTitle();
                $draggedElement.find('.planner-card-time').html(card.titleHeader);
                $draggedElement.data('start', startPosition);
                $draggedElement.data('end', startPosition + length);
                $draggedElement.data('column', assignee);

                Planner.Events.publish('cardUpdated', [card, $draggedElement]);
                resetDrag();
            }
        });

        Planner.Events.subscribe('cardDrawn', function(card, $element) {
            $element.attr('draggable', true);
            $element.on({
                drop: function(event) {
                    // Avoid to drop a card on another card
                    event.preventDefault();
                    event.stopPropagation();
                    resetDrag();
                },
                dragstart: function(event) {
                    // Store current element
                    $draggedElement = $element;

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
                        listReduced.push($element);
                    }
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
