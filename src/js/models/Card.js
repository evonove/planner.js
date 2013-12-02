;(function(Planner){ 'use strict';

    Planner.Model = Planner.Model || {};

    // Card class definition with prototype methods
    // --------------------------------------------

    var Card = function() {
        this.id = null;
        this.title = null;
        this.content = null;
        this.start = null;
        this.end = null;
        this.assignees = [];
    };

    // Methods that should be overridden by your
    // application to enable persistence
    // -----------------------------------------
    Card.prototype.save = function() {};
    Card.prototype.delete = function() {};

    Planner.Model.Card = Card;

})(Planner);
