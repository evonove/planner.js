;(function($, Planner) { 'use strict';

    // Plugin constructor and defaults
    // -------------------------------

    var Mobile = function(planner, options) {
        this.planner = planner;
        this.$element = planner.$element;
        this.options = options;
    };

    Mobile.DEFAULTS = {
        mobileVisibleColumns: 1
    };

    // Create dynamic styles
    // ---------------------

    Mobile.prototype.addMobileStyles = function() {
        var context = {
            mobileWidth: 100 / this.options.mobileVisibleColumns
        };

        $('head').append(Planner.Templates.mobile(context));
    };

    // Crud plugin definition
    // ----------------------

    var old = $.fn.mobile;

    $.fn.mobile = function(option) {
        var planner = this;

        return this.$element.each(function() {
            var $this = $(this);
            var data = $this.data('pl.plugins.mobile');
            var options = $.extend({}, Mobile.DEFAULTS, $this.data('pl.planner').options, typeof option === 'object' && option);

            // If this node isn't initialized, call the constructor
            if (!data) {
                $this.data('pl.plugins.mobile', (data = new Mobile(planner, options)));
            }

            data.addMobileStyles();
        });
    };

    $.fn.mobile.constructor = Mobile;

    // Mobile no conflict
    // ------------------

    $.fn.mobile.noConflict = function() {
        $.fn.mobile = old;
        return this;
    };

    // Register this plugin to plugins list
    // ------------------------------------

    Planner.Plugins.register('mobile', $.fn.mobile);

})(jQuery, Planner);
