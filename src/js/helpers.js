;(function($, Helpers, Handlebars, undefined) { 'use strict';

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

    // Default constructor options
    Helpers.getDefaultColumns = function() {
        return dayColumns;
    };

    Helpers.getDefaultRows = function() {
        return dayColumns;
    };

    // Generate a computed style node
    Helpers.computedCSS = function() {
        var options = Planner.options;

        // Planner related
        var timeslotSize = options.timeslotHeight * options.timeslots;
        var timeslotPadding = options.centered ? timeslotSize / 2 : timeslotSize;

        var cssContext = {
            timeslots: options.timeslots,
            timeslotHeight: options.timeslotHeight,
            timeslotPadding: timeslotSize - options.timeslotPadding,
            lastTimeslotPadding: timeslotPadding,
            sliderWidth: 100 / options.visibleColumns
        };

        return $(Planner.Templates.styles(cssContext));
    };

    // Transform start or end attributes to a valid planner interval (index) according to attribute type
    Helpers.attributeToIndex = function(attribute) {
        var options = Planner.options;
        var index;

        if (typeof attribute.getHours === 'function' && typeof attribute.getMinutes === 'function') {
            index = attribute.getHours() * options.timeslots + attribute.getMinutes() / (60 / options.timeslots);
        } else if (typeof attribute === 'string') {
            index = options.rowLabels.indexOf(attribute);
        } else {
            throw new Error('Unable to find a valid index from start/end card attribute. Define your own implementation.');
        }

        return index;
    };

    // Transform $element index to a valid card start/end object
    Helpers.indexToAttribute = function(index) {
        var options = Planner.options;
        var attribute;

        // Convert date time object
        var hours = Math.floor((index - 1) / options.timeslots);
        var minutes = 15 * (index % options.timeslots);

        if (minutes === index % options.timeslots) {
            hours += 1;
        }

        // TODO convert string object

        attribute = new Date();
        attribute.setHours(hours);
        attribute.setMinutes(minutes);
        attribute.setSeconds(0);

        return attribute;
    };

    // Register Handlebars helpers
    // ---------------------------

    Handlebars.registerHelper('times', function(n, block) {
        var accumulator = '';

        for (var i = 0; i < n; ++i) {
            accumulator += block.fn(i);
        }

        return accumulator;
    });

})(jQuery, Planner.Helpers = Planner.Helpers || {}, Handlebars);
