;(function() { 'use strict';

    // Auxiliar functions
    // ------------------

    var generateDateFromNow = function(hours, minutes) {
        var now = new Date();
        now.setHours(hours);
        now.setMinutes(minutes);
        now.setSeconds(0);

        return now;
    };

    // Some card mocks
    // ---------------

    $(document).ready(function() {
        var card1 = new Planner.Models.Card({
            id: 1,
            title: 'Having a long dinner',
            content: 'Just a comment',
            start: generateDateFromNow(19, 0),
            end: generateDateFromNow(21, 45),
            columns: [1]
        });

        var card2 = new Planner.Models.Card({
            id: 2,
            title: 'DjangoCon meeting!',
            content: '@Orvieto',
            start: generateDateFromNow(8, 0),
            end: generateDateFromNow(15, 30),
            columns: [1]
        });

        var card3 = new Planner.Models.Card({
            id: 3,
            title: 'Hello IT',
            content: 'Standard nerds',
            start: generateDateFromNow(13, 45),
            end: generateDateFromNow(16, 15),
            columns: [2, 4]
        });

        card1.draw();
        card2.draw();
        card3.draw();
    });
})();
