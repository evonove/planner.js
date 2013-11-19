;(function($, Planner) { 'use strict';

    // PlanningChart class definition with defaults
    // ---------------------------------------

    var PlanningChart = function (element, options) {
        this.$element = $(element);
        this.options = options;
    };

    PlanningChart.CONST = {
        ALIGNMENT: {
            TOP: 0,
            MIDDLE: 1
        }
    };

    PlanningChart.DEFAULTS = {
        columns: [],
        rows: [],
        timeslots: 1,
        timeslotsHeight: 25,
        textAlignment: PlanningChart.CONST.ALIGNMENT.TOP,
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

            // Check if columns and rows are set otherwise use a default planner
            if (options.columns.length > 0 && options.rows.length > 0) {
                $this.html(Planner.Templates.body(options));
            } else {
                $this.html(Planner.Helpers.plannerWeekday());
            }

            // Add computed styles
            $('head').append(Planner.Helpers.computedCSS(options));
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
