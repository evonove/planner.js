;(function($, Planner) { 'use strict';

    // PlanningChart class definition with defaults
    // ---------------------------------------

    var PlanningChart = function (element, options) {
        this.$element = $(element);
        this.options = options;
    };

    PlanningChart.DEFAULTS = {
        columns: [],
        visibleColumns: 1
    };

    // PlanningChart widget definition
    // --------------------------

    var old = $.fn.planner;

    $.fn.planner = function(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('pl.planner');
            var options = $.extend({}, PlanningChart.DEFAULTS, $this.data(), typeof option === 'object' && option);

            // If this node isn't initialized, call the constructor
            if (!data) {
                $this.data('pl.planner', (data = new PlanningChart(this, options)));
            }

            // Check if any columns are set otherwise use a default behaviour
            if (options.columns.length > 0) {
                $this.html(Planner.Templates.body({columns: options.columns}));
            } else {
                $this.html(Planner.Templates.body({columns: Planner.Helpers.plannerWeekday()}));
            }
        });
    };

    $.fn.planner.Constructor = PlanningChart;

    // PlanningChart no conflict
    // --------------------

    $.fn.planner.noConflict = function() {
        $.fn.planner = old;
        return this;
    };

    // PlanningChart DATA-API
    // -----------------

    $(window).on('load', function() {
        $('[data-planner="container"]').each(function() {
            var $planner = $(this);
            $planner.planner($planner.data());
        });
    });

})(jQuery, Planner);
