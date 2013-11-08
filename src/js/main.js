;(function($, Planner) { 'use strict';

    var _htmlNode = $('.container'),
        _dayColumn = [
            {name: 'Monday'},
            {name: 'Tuesday'},
            {name: 'Wednesday'},
            {name: 'Thursday'},
            {name: 'Friday'},
            {name: 'Saturday'},
            {name: 'Sunday'}
        ];

    var _htmlPlanner = Planner.Templates.body({columns: _dayColumn});
    _htmlNode.html(_htmlPlanner);
})(jQuery, Planner);
