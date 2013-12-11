;(function($, Plugins) { 'use strict';

    // Plugin constructor and defaults
    // -------------------------------

    var Crud = function(element, options) {
        this.$element = $(element);
        this.options = options;
    };

    Crud.DEFAULTS = {
        readOnly: true
    };

    // Prototype functions
    // -------------------

    // Crud plugin definition
    // ----------------------

    var old = $.fn.crud;

    $.fn.crud = function(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('pl.plugins.crud');
            var options = $.extend({}, Crud.DEFAULTS, $this.data(), typeof option === 'object' && option);

            // If this node isn't initialized, call the constructor
            if (!data) {
                $this.data('pl.plugins.crud', (data = new Crud(this, options)));
            }
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

})(jQuery, Planner && Planner.Plugins);
