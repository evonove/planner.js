;(function(Planner) { 'use strict';

    // Card class definition
    // ---------------------

    var Card = function(object) {
        this.id = object.id;
        this.title = object.title;
        this.content = object.content;
        this.start = object.start;
        this.end = object.end;
        this.assignees = Array.isArray(object.assignees) ? object.assignees : [object.assignees];

        // Object assignment to a global hash map
        Planner.mapCard.put(this, []);
    };

    // Card prototype methods
    // ----------------------

    Card.prototype._generateTitle = function() {
        var self = this;
        var title = '';

        if (typeof self.start.getHours === 'function' && typeof self.start.getMinutes === 'function' && typeof self.end.getHours === 'function' && typeof self.end.getMinutes === 'function') {
            title = Planner.Utils.pad(self.start.getHours()) + ':' + Planner.Utils.pad(self.start.getMinutes()) + ' - ' + Planner.Utils.pad(self.end.getHours()) + ':' + Planner.Utils.pad(self.end.getMinutes());
        } else if (self.start === self.end) {
            title = self.start;
        } else {
            title = self.start + '-' + self.end;
        }

        return title;
    };

    Card.prototype._generateDOM = function(assignee) {
        var options = Planner.options;
        var self = this;
        self.titleHeader = self._generateTitle();

        // Generate a standard Card DOM object
        var cardDOM = $(Planner.Templates.card(self));
        var $element = cardDOM.clone();

        // Convert Card attributes to DOM attributes
        // TODO: +1/-1 used only to maintain the same behaviour on interaction plugin
        var start = Planner.Helpers.attributeToIndex(self.start);
        var end = Planner.Helpers.attributeToIndex(self.end) - 1;
        var cardLength = (end - start + 1) * options.timeslotHeight - options.cardTitleMargin;

        // Set DOM values
        $element.data('column', assignee);
        $element.data('start', start);
        $element.data('end', end);
        $element.height(cardLength);

        // Map DOM with Card
        Planner.mapDom.put($element, self);

        // Map Card with DOM
        var registeredDoms = Planner.mapCard.get(self);
        registeredDoms.push($element);
        Planner.mapCard.put(self, registeredDoms);

        return $element;
    };

    Card.prototype.drawCard = function() {
        var self = this;

        self.assignees.forEach(function(assignee) {
            // Get data-attributes element from card DOM
            var cardDOM = self._generateDOM(assignee);
            var column = cardDOM.data('column');
            var start = cardDOM.data('start');

            // TODO: this function doesn't support multi day events and collisions
            // Find the right column and search starting div to append created object
            // Note: (start + 1) is used because of CSS selector and not because index() function
            Planner.$element.find('.planner-column:nth-child(' + column + ') > div:nth-child(' + (start + 1) + ')').append(cardDOM);
            Planner.Events.publish('cardDrawn', [self, cardDOM]);
        });
    };

    // Register Card model
    // -------------------
    Planner.Model.Card = Card;

})(Planner);
