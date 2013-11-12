;(function($, Planner) { 'use strict';
    Planner.Helpers = {};

    // Local data useful for some helpers
    // ----------------------------------

    var dayColumn = [
        {name: 'Monday'},
        {name: 'Tuesday'},
        {name: 'Wednesday'},
        {name: 'Thursday'},
        {name: 'Friday'},
        {name: 'Saturday'},
        {name: 'Sunday'}
    ];

    // Helpers definition
    // ------------------

    Planner.Helpers = {
        // Create HTML string using a default columns configuration
        plannerWeekday: function() {
            return Planner.Templates.body({columns: dayColumn});
        }
    };


})(jQuery, Planner);
