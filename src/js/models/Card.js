;(function(Planner) { 'use strict';

    // Card class definition
    // ---------------------

    var Card = function(object) {
        this.id = object.id || null;
        this.title = object.title || null;
        this.content = object.content || null;
        this.start = object.start || null;
        this.end = object.end || null;
        this.assignees = object.assignees || [];

        this.titleHeader = this._generateTitle();

        // Object assignment to a global hash map
        Planner.mapCard.put(this, []);
    };

    // Card prototype methods
    // ----------------------

    Card.prototype._generateTitle = function() {
        var title = '';

        if(this.start !== null && this.end !== null) {
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

    Card.prototype._generateDom = function(assignee) {
        var self = this;

        // Generate a standard Card DOM object
        var $element = $(Planner.Templates.card(self));
        self.updateDom($element, assignee);

        // Bidirectional mapping between Card and DOM object
        Planner.mapDom.put($element, self);
        Planner.mapCard.get(self).push($element);

        return $element;
    };

    Card.prototype.updateDom = function($element, assignee) {
        var options = Planner.options;

        var self = this;
        var start = Planner.Helpers.attributeToIndex(self.start);
        var end = Planner.Helpers.attributeToIndex(self.end) - 1;

        // TODO: corner case for last timeslot caused by not managing multiple days
        if (end < 0) {
            end = options.timeslots * options.rowLabels.length - 1;
        }

        if (start <= end) {
            var cardLength = (end - start + 1) * options.timeslotHeight - options.cardTitleMargin;

            // Update data attributes
            if (typeof assignee !== 'undefined')  {
                $element.data('column', assignee);
            }

            $element.data('start', start);
            $element.data('end', end);

            // Update DOM attributes
            $element.find('.planner-card-time').html(self.titleHeader);
            $element.height(cardLength);
        }
    };

    Card.prototype.updateCard = function(values) {
        this.id = values.id || this.id;
        this.title = values.title || this.title;
        this.content = values.content || this.content;
        this.start = values.start || this.start;
        this.end = values.end || this.end;
        this.assignees = values.assignees || this.assignees;

        this.titleHeader = this._generateTitle();
    };

    Card.prototype.drawCard = function() {
        var self = this;

        self.assignees.forEach(function(assignee) {
            // Get data-attributes element from card DOM
            var cardDom = self._generateDom(assignee);

            var column = cardDom.data('column');
            var start = cardDom.data('start');

            // TODO: this function doesn't support multi day events and collisions
            // Find the right column and search starting div to append created object
            // Note: (start + 1) is used because of CSS selector and not because index() function
            Planner.$element.find('.planner-column:nth-child(' + column + ') > div:nth-child(' + (start + 1) + ')').append(cardDom);
            Planner.Events.publish('cardDrawn', [self, cardDom]);
        });
    };

    // Register Card model
    // -------------------
    Planner.Model.Card = Card;

})(Planner);
