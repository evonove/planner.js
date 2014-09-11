(function (window, Plugins, Utils, undefined) {
  'use strict';

  // Plugin constructor and defaults
  // -------------------------------

  var Hourline = function (element, options) {
    var hourline = Utils.createElement(Planner.Templates.hourline());

    document.querySelector('.planner-container').appendChild(hourline);

    scrollScreen();
    moveLine();

    window.setInterval(moveLine, options.hourlineTickUpdate * 3600);

    // Helpers
    // -------

    function findHeight (date) {
      var effectiveHours = date.getHours() + (date.getMinutes() / 60);
      return (effectiveHours * options.timeslotHeight * options.timeslots) + options.hourlineMargin;
    }

    function scrollScreen () {
      var hourlineTop = findHeight(new Date())
        , offset = window.screen.height / options.hourlineScreenSection;

      window.scroll(0, hourlineTop - offset);
    }

    function moveLine () {
      var hourlineTop = findHeight(new Date());

      hourline.style.top = hourlineTop + 'px';
    }
  };

  Hourline.DEFAULTS = {
    hourlineMargin: 85,
    hourlineScreenSection: 3,
    hourlineTickUpdate: 5
  };

  // Register this plugin to plugins list
  // ------------------------------------

  Plugins.register('hourline', Hourline);

})(window, Planner.Plugins, Planner.Utils);
