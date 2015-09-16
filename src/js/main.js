(function (undefined) {
  'use strict';

  // Auxiliar functions
  // ------------------

  var generateDateFromNow = function (hours, minutes) {
    var now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);

    return now;
  };

  // Some card mocks
  // ---------------

  document.addEventListener('DOMContentLoaded', function () {
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
      start: generateDateFromNow(13, 0),
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

    var card4 = new Planner.Models.Card({
      id: 4,
      title: 'Having another dinner :(',
      content: 'Just a comment',
      start: generateDateFromNow(19, 0),
      end: generateDateFromNow(21, 45),
      columns: [1]
    });

    // Planner options
    var element = document.querySelector('.js-planner');
    var options = {
      plugins: [
        'slider',
        'collision',
        'mobile',
        'interaction',
        'hourline'
      ],
      mobileVisibleColumns: {
        phone: {
          landscape: 7,
          portrait: 1
        },
        tablet: {
          landscape: 5,
          portrait: 3
        }
      }
    };

    // Init and draw cards
    var planner = new Planner(element, options);
    planner.drawCard(card1);
    planner.drawCard(card2);
    planner.drawCard(card3);
    planner.drawCard(card4);
  });

})();
