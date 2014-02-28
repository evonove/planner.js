;(function($, Planner, HashMap) { 'use strict';

    // PlanningChart class definition with defaults
    // --------------------------------------------

    var PlanningChart = function (element, options) {
        this.$element = $(element);
        this.options = options;
        this.mapCard = new HashMap();
        this.mapDom = new HashMap();
    };

    PlanningChart.CONST = {
        ALIGNMENT: {
            TOP: 0,
            MIDDLE: 1
        }
    };

    PlanningChart.DEFAULTS = {
        show: true,
        plugins: [],
        timeslots: 4,
        timeslotHeight: 25,
        timeslotPadding: 20,
        cardTitleMargin: 6,
        centered: PlanningChart.CONST.ALIGNMENT.TOP,
        columnLabels: [],
        rowLabels: [],
        visibleColumns: 7
    };

    // PlanningChart widget definition
    // -------------------------------

    var old = $.fn.planner;

    $.fn.planner = function(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('pl.planner');
            var options = $.extend({}, PlanningChart.DEFAULTS, $this.data(), typeof option === 'object' && option);

            // Check if columns and rows are set otherwise use a default planner
            if (options.columnLabels.length === 0) {
                options.columnLabels = Planner.Helpers.getDefaultColumns();
            }

            if (options.rowLabels.length === 0) {
                options.rowLabels = Planner.Helpers.getDefaultRows();
            }

            // Edit some properties
            options.visibleColumns = options.visibleColumns > options.columnLabels.length ? options.columnLabels.length : options.visibleColumns;

            // If this node isn't initialized, call the constructor
            if (!data) {
                $this.data('pl.planner', (data = new PlanningChart(this, options)));
                this.setAttribute('data-planner', 'container');
            }

            // TODO: better implementation required
            // Planner attributes available on whole namespace
            Planner.$element = data.$element;
            Planner.options = data.options;
            Planner.mapCard = data.mapCard;
            Planner.mapDom = data.mapDom;

            // Initialize planner template only if required
            if (options.show) {
                $this.html(Planner.Templates.body(options));
            }

            // Append all computed CSS
            $('head').append(Planner.Helpers.computedCSS());

            // Load attached plugins
            Planner.Plugins.load(options.plugins, data);
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

            // Allows plugins definition with data attributes
            var plugins = $planner.data('plugins') && $planner.data('plugins').split(' ');

            // Load default plugins
            plugins.push('slider');

            // Planner initialization
            $planner.data('plugins', plugins);
            $planner.planner($planner.data());
        });
    });

})(jQuery, Planner, Planner.Utils.HashMap);
