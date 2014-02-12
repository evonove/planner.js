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
                mouseup: function(event) {
                    // Avoid this action on event propagation from children
                    if (event.currentTarget === event.target) {
                        Planner.Events.publish('cardClicked', [card, $element]);
                    }
                }
            });
        });
    };

    Crud.prototype.attachDragCreation = function() {
        var self = this;

        self.$element.find('.planner-column > div').on({
            mousedown: function(event) {
                // Avoid this action on event propagation from children
                if (event.currentTarget === event.target) {
                    var $this = $(this);

                    // Start interaction with created objects
                    var card = self._createCard($this);
                    self._startInteraction(card, Planner.mapCard.get(card)[0], $this.index(), event.clientY);
                    event.preventDefault();
                }
            },
            mousemove: function(event) {
                if (self.currentCard !== null) {
                    self._resize(event.clientY);

                    event.preventDefault();
                }
            },
            mouseup: function(event) {
                if (self.currentCard !== null) {
                    Planner.Events.publish('cardCreated', [self.currentCard, self.currentElement]);

                    self._stopInteraction();
                    event.preventDefault();
                }
            }
        });
    };

    Crud.prototype.attachDragAndDrop = function() {
        var self = this;

        // Happend drag events to timeslots
        self.$element.find('.planner-column > div').on({
            dragover:  function(event) {
                event.preventDefault();
            },
            drop: function(event) {
                self._drag(this);
                self._resetDrag();

                // Note: remove all temporary clones because of webkit bug/feature
                if (!!window.webkitURL) {
                    $('[data-planner=container] > .planner-card').remove();
                }

                Planner.Events.publish('cardUpdated', [self.currentCard, self.currentElement]);

                self._stopInteraction();
                event.preventDefault();
            }
        });

        Planner.Events.subscribe('cardDrawn', function(card, $element) {
            $element.attr('draggable', true);
            $element.on({
                dragstart: function(event) {
                    // Start interaction with created objects
                    self._startInteraction(card, $element);

                    // Required for Firefox
                    event.originalEvent.dataTransfer.effectAllowed = 'move';
                    event.originalEvent.dataTransfer.setData('text/html', '[Object] Card');

                    // Note: in webkit browsers, drag-n-drop doesn't create a ghost image if the original
                    // object is placed inside a container with -webkit-transform attribute. The only available
                    // solution (at the moment) is to clone the object and put it inside an upper container.
                    var draggedNode = this;
                    if (!!window.webkitURL) {
                        draggedNode = this.cloneNode(true);
                        $(draggedNode).width($(this).width());
                        $(draggedNode).addClass('dragging');
                        $('[data-planner=container]').append(draggedNode);
                    }

                    event.originalEvent.dataTransfer.setDragImage(draggedNode, 20, 20);

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
            var draggableDom = $(Planner.Templates.drag({dragComponent: self.options.dragComponent})).on({
                mousedown: function(event) {
                    self._startInteraction(card, $element, Planner.Helpers.attributeToIndex(card.start), $element.offset().top - $(window).scrollTop());
                    self.currentElement.addClass('resizable');

                    event.preventDefault();
                }
            });

            // Append element after latest DOM object of a Card
            $element.find('.planner-card-title').after(draggableDom);

            // Attach resize listeners
            $element.on({
                mousemove: function(event) {
                    if ($element.hasClass('resizable')) {
                        self._resize(event.clientY);

                        // Avoid other actions
                        event.preventDefault();
                    }
                },
                mouseup: function(event) {
                    if ($element.hasClass('resizable')) {
                        Planner.Events.publish('cardUpdated', [card, $element]);
                        self.currentElement.removeClass('resizable');


                        self._stopInteraction();
                        event.preventDefault();
                    }
                }
            });
        });
    };

    Crud.prototype.attachMobileListeners = function() {
        var self = this;

        self.$element.find('.planner-column > div').on({
            touchmove: function(event) {
                if (self.currentCard !== null) {
                    self._resize(event.originalEvent.touches[0].clientY);
                    event.preventDefault();
                }
            },
            touchend: function(event) {
                Planner.Events.publish('cardCreated', [self.currentCard, self.currentElement]);

                self._stopInteraction();
                event.preventDefault();
            }
        });

        Planner.Events.subscribe('cardDrawn', function(card, $element) {
            $element.on({
                touchend: function() {
                    Planner.Events.publish('cardClicked', [card, $element]);
                    // TODO: check if this is required to "Avoid propagation of element on child/parent elements"
                    // event.stopPropagation();
                }
            });
        });
    };

    // Private plugin helpers
    // ----------------------

    Crud.prototype._createCard = function($element) {
        // Create a new card and draw DOM element
        var startAttribute = Planner.Helpers.indexToAttribute($element.index());
        var endAttribute = Planner.Helpers.indexToAttribute($element.index() + 1);
        var assignee = [$element.parent().index() + 1];
        var card = new Planner.Model.Card({start: startAttribute, end: endAttribute, assignees: assignee});
        card.drawCard();

        return card;
    };


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
        this.initialIndex = null;
        this.initialY = null;
    };

    Crud.prototype._drag = function(destination) {
        var length = this.currentElement.data('end') - this.currentElement.data('start');

        this.currentElement.appendTo(destination);
        var assignee = this.currentElement.parent().parent().index() + 1;
        var startPosition = this.currentElement.parent().index();

        // Update Card  and DOM object
        this.currentCard.updateCard({
            assignees: [assignee],
            start: Planner.Helpers.indexToAttribute(startPosition),
            end: Planner.Helpers.indexToAttribute(startPosition + length + 1)
        });

        this.currentCard.updateDom(this.currentElement, assignee);
    };

    Crud.prototype._resize = function(pointerY) {
        // Calculate new length
        var currentCardPosition = Math.floor((pointerY - this.initialY) / this.options.timeslotHeight);
        var endIndex = this.initialIndex + currentCardPosition;

        // Update Card  and DOM object
        this.currentCard.updateCard({end: Planner.Helpers.indexToAttribute(endIndex + 1)});
        this.currentCard.updateDom(this.currentElement);
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

            if (Planner.Plugins.isRegistered('mobile')) {
                data.attachMobileListeners();
            }

            // Add interaction styles
            $('head').append(Planner.Templates.interaction());
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
