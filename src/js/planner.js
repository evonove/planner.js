;(function(window, undefined) { 'use strict';

    // PlanningChart class
    // -------------------

    var PlanningChart = function (element, options) {
        // Merge options with defaults
        options = window.Planner.Utils.extend(PlanningChart.DEFAULTS, options);

        // Return instance
        return new window.Planner.Instance(element, options);
    };

    PlanningChart.CONST = {
        ALIGNMENT: {
            TOP: 0,
            MIDDLE: 1
        }
    };

    PlanningChart.DEFAULTS = {
        // TODO: use a better strategy to avoid planner draw
        show: true,
        // model: Planner.Models.Card, TODO: disabled for now
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

    // Initialize with data-api
    // ------------------------

    document.addEventListener('DOMContentLoaded', function(){
        var plannerElements = document.querySelectorAll('[data-planner="container"]');

        for (var i = 0; i < plannerElements.length; i++) {
            // Get all params from selectors
            var plugins = plannerElements[i].getAttribute('data-plugins');
            plugins = (plugins && plugins.split(' ')) || [];

            // Load default plugins
            plugins.push('slider');

            // Planner initialization
            // TODO: how to get options from there?
            new window.Planner.Instance(plannerElements[i], PlanningChart.DEFAULTS);
        }
    });

    window.Planner = PlanningChart;

})(window);
