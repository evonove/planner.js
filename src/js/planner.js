;(function($, Planner) { 'use strict';

    // _Planner class definition with defaults
    // ---------------------------------------

    var _Planner = function (element, options) {
        this.$element = $(element);
        this.options = options;
    };

    _Planner.DEFAULTS = {
        columns: [],
        visibleColumns: 1
    };

    // _Planner widget definition
    // --------------------------

    var old = $.fn.planner;

    $.fn.planner = function(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('pl.planner');
            var options = $.extend({}, _Planner.DEFAULTS, $this.data(), typeof option === 'object' && option);

            // If this node isn't initialized, call the constructor
            if (!data) {
                $this.data('pl.planner', (data = new _Planner(this, options)));
            }

            // Check if any columns are set otherwise use a default behaviour
            if (options.columns.length > 0) {
                $this.html(Planner.Templates.body({columns: options.columns}));
            } else {
                $this.html(Planner.Templates.body({columns: Planner.Helpers.plannerWeekday()}));
            }
        });
    };

    $.fn.planner.Constructor = _Planner;

    // _Planner no conflict
    // --------------------

    $.fn.planner.noConflict = function() {
        $.fn.planner = old;
        return this;
    };

    // _Planner DATA-API
    // -----------------

    $(window).on('load', function() {
        $('[data-planner="container"]').each(function() {
            var $planner = $(this);
            $planner.planner($planner.data());
        });
    });

})(jQuery, Planner);
