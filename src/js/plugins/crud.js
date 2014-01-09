;(function($, Plugins, Card) { 'use strict';

    // Plugin constructor and defaults
    // -------------------------------

    var Crud = function(planner, options) {
        this.planner = planner;
        this.$element = $(planner.$element);
        this.options = options;

        this.currentCard = null;
    };

    Crud.DEFAULTS = {
        readOnly: true
    };

    // Prototype functions
    // -------------------

    Crud.prototype.attachDragCreation = function() {
        var self = this;

        self.$element.find('.column > div:not(.column-header)')
            .on('mousedown', function(e) {
                // Start card creation
                var $this = $(this);
                var startAttribute = Planner.Helpers.indexToAttribute($this.index() - 1);
                var assignee = [$this.parent().index() + 1];
                self.startCard(startAttribute, assignee);

                // Avoid other actions
                e.preventDefault();
            })
            .on('mouseup', function(e) {
                // End card creation
                var $this = $(this);
                var endAttribute = Planner.Helpers.indexToAttribute($this.index());
                self.endCard(endAttribute);

                // Avoid other actions
                e.preventDefault();
            });
    };

    Crud.prototype.startCard = function(startAttribute, assignee) {
        this.currentCard = new Card({start: startAttribute, assignees: assignee});
    };

    Crud.prototype.endCard = function(endAttribute) {
        this.currentCard.end = endAttribute;
        this.currentCard.generateDOM();

        // Card drawing
        this.planner.drawCard(this.currentCard);
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

            data.attachDragCreation();
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

    Plugins.register('crud', $.fn.crud);

})(jQuery, Planner.Plugins, Planner.Model.Card);
