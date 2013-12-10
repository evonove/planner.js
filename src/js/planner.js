;(function($, Planner) { 'use strict';

    // PlanningChart class definition with defaults
    // --------------------------------------------

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

    // Prototype functions
    // -------------------

    /**
     * TODO: this function doesn't support multi day events
     * @param card to draw
     */
    PlanningChart.prototype.drawCard = function(card) {
        var self = this;

        card.$element.forEach(function(cardDOM) {
            // Get data-attributes element from card DOM
            var column = cardDOM.data('column');
            var start = cardDOM.data('start');
            var end = cardDOM.data('end');
            var cardLength = (end - start) * self.options.timeslotHeight;

            // Set height according to card length
            cardDOM.height(cardLength);

            // Find the right column and search starting div; append created object
            // TODO test collisions
            self.$element.find('.column:nth-child(' + column + ') > div:nth-child(' + start + ')').append(cardDOM);
        });
    };

    // PlanningChart widget definition
    // -------------------------------

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

            // Planner helpers can control options
            Planner.Helpers.options = options;

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

    $.fn.planner.constructor = PlanningChart;

    // PlanningChart no conflict
    // -------------------------

    $.fn.planner.noConflict = function() {
        $.fn.planner = old;
        return this;
    };

    // PlanningChart DATA-API
    // ----------------------

    $(document).ready(function() {
        $('[data-planner="container"]').each(function() {
            var $planner = $(this);
            $planner.planner($planner.data());
        });
    });

})(jQuery, Planner);
