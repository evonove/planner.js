(function (window, Plugins, Utils, undefined) {
  'use strict';

  // Plugin constructor
  // ------------------

  function Hourline (element, options) {
    var hourline = Utils.createElement(Planner.Templates.hourline());

    element.querySelector('.planner-container').appendChild(hourline);

    scrollScreen();
    moveLine();

    window.setInterval(moveLine, options.hourlineTickUpdate * 3600);

    // Public methods
    // --------------

    this.findHeight = findHeight;

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
  }

  // Defaults
  // --------

  Hourline.DEFAULTS = {
    hourlineMargin: 85,
    hourlineScreenSection: 3,
    hourlineTickUpdate: 5
  };

  // Register this plugin to plugins list
  // ------------------------------------
  Plugins.Hourline = Hourline;
  Plugins.register('hourline', Hourline);

})(window, Planner.Plugins, Planner.Utils);
