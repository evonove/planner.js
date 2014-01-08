;(function(Planner, Utils){ 'use strict';

    Planner.Model = Planner.Model || {};

    // Card class definition with prototype methods
    // --------------------------------------------

    var Card = function(args) {
        this.id = args.id;
        this.title = args.title;
        this.content = args.content;
        this.start = args.start;
        this.end = args.end;
        this.assignees = args.assignees;

        // Generate DOM if all required arguments are defined
        if(typeof this.start !== 'undefined' && typeof this.end !== 'undefined' && typeof this.assignees !== 'undefined') {
            this.generateDOM();
        }
    };

    // Card class definition with prototype methods
    // --------------------------------------------

    Card.prototype.generateTitle = function() {
        var self = this;
        var title;

        if (typeof self.start.getHours === 'function' && typeof self.start.getMinutes === 'function' && typeof self.end.getHours === 'function' && typeof self.end.getMinutes === 'function') {
            title = Utils.pad(self.start.getHours()) + ':' + Utils.pad(self.start.getMinutes()) + ' - ' + Utils.pad(self.end.getHours()) + ':' + Utils.pad(self.end.getMinutes());
        } else if (self.start === self.end) {
            title = self.start;
        } else {
            title = self.start + '-' + self.end;
        }

        return title;
    };

    Card.prototype.generateDOM = function() {
        var options = Planner.options;
        var self = this;
        self.titleHeader = self.generateTitle();

        // Generate a standard Card DOM object
        var generatedElements = [];
        var cardDOM = $(Planner.Templates.card(self));
        var element;

        // Generate DOM element for each assignees
        this.assignees.forEach(function(assignee) {
            element = cardDOM.clone();

            // Convert Card attributes to DOM attributes
            var start = Planner.Helpers.attributeToIndex(self.start);
            var end = Planner.Helpers.attributeToIndex(self.end);
            var cardLength = (end - start) * options.timeslotHeight - options.cardTitleMargin;

            // Set DOM values
            element.data('column', assignee);
            element.data('start', start);
            element.data('end', end);
            element.height(cardLength);

            generatedElements.push(element);
        });

        self.$element = generatedElements;
    };

    // Methods that should be overridden by your
    // application to enable persistence
    // -----------------------------------------

    Card.prototype.save = function() {};
    Card.prototype.delete = function() {};

    Planner.Model.Card = Card;

})(Planner, Planner.Utils);
