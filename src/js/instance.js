;(function(Planner, undefined) { 'use strict';

    // Defines Planner.js instance
    // ---------------------------

    Planner.Instance = function(element, options) {
        this.element = element;
        this.options = options;

        // Initialize HashMaps to store planner Card status
        this.mapCard = new HashMap();
        this.mapDom = new HashMap();
    };

})(window.Planner = window.Planner || {});
