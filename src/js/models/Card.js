;(function(Planner, Utils){ 'use strict';

    Planner.Model = Planner.Model || {};

    // Card class definition with prototype methods
    // --------------------------------------------

    var Card = function(id, title, content, start, end, assignees) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.start = start;
        this.end = end;
        this.assignees = assignees;

        this.titleHeader = this.generateTitle(start, end);
        this.$element = this.generateDOM();
    };

    // Card class definition with prototype methods
    // --------------------------------------------

    Card.prototype.generateTitle = function(start, end) {
        var title;

        if (typeof start.getHours === 'function' && typeof start.getMinutes === 'function' && typeof end.getHours === 'function' && typeof end.getMinutes === 'function') {
            title = Utils.pad(start.getHours()) + ':' + Utils.pad(start.getMinutes()) + '-' + Utils.pad(end.getHours()) + ':' + Utils.pad(end.getMinutes());
        } else if (start === end) {
            title = start;
        } else {
            title = start + '-' + end;
        }

        return title;
    };

    Card.prototype.generateDOM = function() {
        var self = this;
        var generatedElements = [];

        // Generate a standard DOM element
        var cardDOM = $(Planner.Templates.card(self));
        var element;

        // Generate DOM element for each assignees
        this.assignees.forEach(function(value) {
            element = cardDOM.clone();
            element.data('column', value);
            element.data('start', Planner.Helpers.attributeToIndex(self.start));
            element.data('end', Planner.Helpers.attributeToIndex(self.end));

            generatedElements.push(element);
        });

        return generatedElements;
    };

    // Methods that should be overridden by your
    // application to enable persistence
    // -----------------------------------------

    Card.prototype.save = function() {};
    Card.prototype.delete = function() {};

    Planner.Model.Card = Card;

})(Planner, Planner.Utils);
