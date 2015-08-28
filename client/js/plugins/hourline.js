(function (window, Plugins, Utils, BinaryHeap, undefined) {
  'use strict';

  // Plugin constructor
  // ------------------

  function Hourline (element, options, planner) {
    var visibility = true;
    var hourline = Utils.createElement(Planner.Templates.hourline());

    element.querySelector('.planner-container').appendChild(hourline);

    scrollScreen();
    moveLine();

    window.setInterval(moveLine, options.hourlineTickUpdate * 3600);

    // Public methods
    // --------------

    this.findHeight = findHeight;
    this.show = show;
    this.hide = hide;
    this.toggle = toggle;
    this.redrawLoop = new EventHeap();

    // Helpers
    // -------

    function findHeight () {
      var date = new Date(),
          effectiveHours = date.getHours() + (date.getMinutes() / 60);

      return (effectiveHours * options.timeslotHeight * options.timeslots) + options.hourlineMargin;
    }

    function scrollScreen () {
      var hourlineTop = findHeight(),
          offset = window.screen.height / options.hourlineScreenSection;

      window.scroll(0, hourlineTop - offset);
    }

    function moveLine () {
      var hourlineTop = findHeight();

      hourline.style.top = hourlineTop + 'px';
    }

    function show () {
      visibility = true;
      hourline.style.display = 'inherit';
    }

    function hide () {
      visibility = false;
      hourline.style.display = 'none';
    }

    function toggle () {
      visibility = !visibility;
      if (visibility) {
        show();
      } else {
        hide();
      }
    }

    // Heap utilities
    // --------------

    function toNextMultiple (of, after) {
      return of - after % of;
    }

    function isPast(card) {
      return card.start <= Date.now();
    }

    // Heap Event looper
    // -----------------

    function EventHeap() {
      function scoreFunction(event) {
        return event.start;
      }

      function toNextRedraw() {
        return toNextMultiple(options.redrawInterval, Date.now()) + 1000;
      }

      function decorate(heap) {
        var _push = heap.push ;

        heap.push = function (card) {
          if (!isPast(card)) {
            // adds the card to the redraw loop
            _push.apply(heap, [card]);

            if (heap.size() === 1) {
              heap.loop();
            }
          } else {
            // this card is already in the past; redraw it
            heap.redraw(card);
          }
        };

        heap.update = function (card) {
          heap.redraw(card);
          heap.remove(card);
          heap.push(card);
        };

        heap.peek = function() {
          return heap.size() ? heap.content[0] : null;
        };

        heap.redraw = function(card) {
          var redrawFn = isPast(card) ? Utils.addClass : Utils.removeClass;
          var doms = planner.mapCard.get(card);

          for (var key in doms) {
            if (doms.hasOwnProperty(key)) {
              redrawFn(doms[key], 'past-event');
            }
          }
        };

        heap.action = function() {
          var event;
          while ((event = heap.peek()) && event.start <= Date.now()) {
            heap.redraw(heap.pop());
          }
        };

        heap.clear = function() {
          heap.content = [];
          if (heap.timer) {
            clearTimeout(heap.timer);
            heap.timer = null;
          }
        };

        heap.loop = function() {
          heap.timer = setTimeout(
            function() {
              heap.action();
              heap.loop();
            },
            toNextRedraw()
          );
        };
      }

      // creating a redraw loop that uses a Heap
      var heap = new BinaryHeap(scoreFunction);
      decorate(heap);

      // attaching to Planner.js events;
      // this makes the Hourline plugin self-sufficient
      planner.events.subscribe('cardCreated', heap.push);
      planner.events.subscribe('cardDeleted', heap.remove);
      planner.events.subscribe('cardUpdated', heap.update);
      planner.events.subscribe('plannerClear', heap.clear);

      return heap;
    }
  }

  // Defaults
  // --------

  Hourline.DEFAULTS = {
    hourlineMargin: 85,
    hourlineScreenSection: 3,
    hourlineTickUpdate: 5,
    redrawInterval: 900000
  };

  // Register this plugin to plugins list
  // ------------------------------------
  Plugins.Hourline = Hourline;
  Plugins.register('hourline', Hourline);

})(window, Planner.Plugins, Planner.Utils, Ds.BinaryHeap);
