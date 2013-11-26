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
        timeslots: 4,
        timeslotHeight: 25,
        timeslotPadding: 20,
        timeslotStartPadding: 45,
        centered: PlanningChart.CONST.ALIGNMENT.TOP,
        columnLabels: [],
        rowLabels: []
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
            if (options.columnLabels.length > 0 && options.rowLabels.length > 0) {
                $this.html(Planner.Templates.body(options));
            } else {
                $this.html(Planner.Helpers.plannerWeekday(options));
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
