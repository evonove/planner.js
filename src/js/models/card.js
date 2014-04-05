;(function(Planner, undefined) { 'use strict';

    // Private methods
    // ---------------

    var _generateHeader = function() {
        var title = '';

        if (this.start !== null && this.end !== null) {
            if (typeof this.start.getHours === 'function' && typeof this.start.getMinutes === 'function' && typeof this.end.getHours === 'function' && typeof this.end.getMinutes === 'function') {
                title = Planner.Utils.pad(this.start.getHours()) + ':' + Planner.Utils.pad(this.start.getMinutes()) + ' - ' + Planner.Utils.pad(this.end.getHours()) + ':' + Planner.Utils.pad(this.end.getMinutes());
            } else if (this.start === this.end) {
                title = this.start;
            } else {
                title = this.start + '-' + this.end;
            }
        }

        return title;
    };

    var _updateDom = function($element, column) {
        var options = Planner.options;
        var start = Planner.Helpers.attributeToIndex(this.start);
        var end = Planner.Helpers.attributeToIndex(this.end) - 1;

        // TODO: corner case for last timeslot caused by not managing multiple days
        if (end < 0) {
            end = options.timeslots * options.rowLabels.length - 1;
        }

        if (start <= end) {
            var cardLength = (end - start + 1) * options.timeslotHeight - options.cardTitleMargin;

            // Update data attributes
            if (typeof column !== 'undefined')  {
                $element.data('column', column);
            }

            $element.data('start', start);
            $element.data('end', end);

            // Update DOM attributes
            $element.find('.planner-card-time').html(this.header);
            $element.height(cardLength);
        }
    };

    var _refresh = function(attrs) {
        this.id = attrs.id || this.id;
        this.title = attrs.title || this.title;
        this.content = attrs.content || this.content;
        this.start = attrs.start || this.start;
        this.end = attrs.end || this.end;
        this.columns = attrs.columns || this.columns;
    };

    var _drawCard = function() {
        this.columns.forEach(function(column) {
            // Generate a standard Card DOM object
            var cardDom = $(Planner.Templates.card(this));
            _updateDom.apply(this, [cardDom, column]);

            // Bidirectional mapping between Card and DOM object
            Planner.mapDom.put(cardDom, this);
            Planner.mapCard.get(this).push(cardDom);

            // Get data-attributes element from card DOM
            var dataColumn = cardDom.data('column');
            var dataStart = cardDom.data('start');

            // TODO: this function doesn't support multi day events and collisions
            // Find the right column and search starting div to append created object
            // Note: (start + 1) is used because of CSS selector and not because index() function
            Planner.$element.find('.planner-column:nth-child(' + dataColumn + ') > div:nth-child(' + (dataStart + 1) + ')').append(cardDom);
            Planner.Events.publish('cardDrawn', [this, cardDom]);
        }.bind(this));
    };

    var _removeDom = function(cardDom) {
        var domList = Planner.mapCard.get(this);
        var elementPos = domList.map(function(x) {return x._hash; }).indexOf(cardDom._hash);

        if (elementPos !== -1) {
            domList.splice(elementPos, 1);
            cardDom.remove();

            this.columns.splice(this.columns.indexOf(cardDom.data('column')), 1);
            Planner.mapDom.remove(cardDom);
            Planner.Events.publish('cardDomDeleted', [this, cardDom]);
        }
    };

    var _remove = function() {
        var domList = Planner.mapCard.get(this);

        // Remove all related dom objects
        domList.forEach(function(domElement) {
            this.removeDom(domElement);
        }.bind(this));

        // Remove Card object from hash table
        Planner.mapCard.remove(this);
        Planner.Events.publish('cardDeleted', [this]);
    };

    // Card class definition
    // ---------------------

    Planner.Models.Card = function(attrs) {
        var object = {};

        // Base attributes
        object.id = attrs.id || null;
        object.title = attrs.title || null;
        object.content = attrs.content || null;
        object.start = attrs.start || null;
        object.end = attrs.end || null;
        object.columns = attrs.columns || [];

        // Computed properties
        Object.defineProperty(object, 'header', {get: _generateHeader});

        // Public methods
        object.refresh = _refresh;
        object.refreshDom = _updateDom;
        object.draw = _drawCard;
        object.removeDom = _removeDom;
        object.remove = _remove;

        // Object assignment to a global hash map
        Planner.mapCard.put(object, []);

        return object;
    };

})(Planner);
