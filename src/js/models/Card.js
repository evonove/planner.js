;(function(Planner){ 'use strict';

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

        this.$element = this.generateDOM();
    };

    // Card class definition with prototype methods
    // --------------------------------------------

    Card.prototype.generateDOM = function() {
        var self = this;
        var generatedElements = [];

        // Generate a standard DOM element
        var cardDOM = $(Planner.Templates.card(self));
        var element;

        // Generate DOM element for each assignees (column)
        this.assignees.forEach(function(value) {
            element = cardDOM.clone();
            element.data('column', value);

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

})(Planner);
