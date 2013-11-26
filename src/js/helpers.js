;(function($, Planner, Handlebars) { 'use strict';

    // Local data useful for some helpers
    // ----------------------------------

    var dayColumns = [
        {name: 'Monday'},
        {name: 'Tuesday'},
        {name: 'Wednesday'},
        {name: 'Thursday'},
        {name: 'Friday'},
        {name: 'Saturday'},
        {name: 'Sunday'}
    ];

    var hourRows = [
        {name: '00:00'},
        {name: '01:00'},
        {name: '02:00'},
        {name: '03:00'},
        {name: '04:00'},
        {name: '05:00'},
        {name: '06:00'},
        {name: '07:00'},
        {name: '08:00'},
        {name: '09:00'},
        {name: '10:00'},
        {name: '11:00'},
        {name: '12:00'},
        {name: '13:00'},
        {name: '14:00'},
        {name: '15:00'},
        {name: '16:00'},
        {name: '17:00'},
        {name: '18:00'},
        {name: '19:00'},
        {name: '20:00'},
        {name: '21:00'},
        {name: '22:00'},
        {name: '23:00'}
    ];

    // Planner helpers
    // ---------------

    Planner.Helpers = {
        // Generate a computed style node
        computedCSS: function(options) {
            var styleNode = $('<style></style>');
            var timeslotSize = options.timeslotsHeight * options.timeslots;
            var timeslotPadding = options.textAlignment ? timeslotSize / 2 : timeslotSize;

            styleNode.html(Planner.Templates.styles({
                topPadding: (options.textAlignment && timeslotPadding) + 45,
                rowHeight: options.timeslotsHeight,
                rowPadding: timeslotSize - 20,
                rowPaddingBottom: timeslotPadding,
                timeslots: options.timeslots
            }));

            return styleNode;
        },
        // Create HTML string using a default columns configuration
        plannerWeekday: function(options) {
            return Planner.Templates.body({columns: dayColumns, rows: hourRows, timeslots: options.timeslots});
        }
    };

    // Handlebars helpers
    // ------------------

    Handlebars.registerHelper('times', function(n, block) {
        var accumulator = '';

        for (var i = 0; i < n; ++i) {
            accumulator += block.fn(i);
        }

        return accumulator;
    });

})(jQuery, Planner, Handlebars);
