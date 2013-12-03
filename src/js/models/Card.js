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
    };

    // Methods that should be overridden by your
    // application to enable persistence
    // -----------------------------------------
    Card.prototype.save = function() {};
    Card.prototype.delete = function() {};

    Planner.Model.Card = Card;

})(Planner);
