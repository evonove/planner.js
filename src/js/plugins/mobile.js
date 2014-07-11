(function (Plugins, Utils, undefined) {
  'use strict';

  // Plugin constructor and defaults
  // -------------------------------

  var Mobile = function (element, options) {
    var context = {
      mobileWidth: 100 / options.mobileVisibleColumns
    };

    // Add mobile styles
    document.querySelector('head').appendChild(Utils.createElement(Planner.Templates.mobile(context)));
  };

  Mobile.DEFAULTS = {
    mobileVisibleColumns: 1
  };

  // Register this plugin to plugins list
  // ------------------------------------

  Plugins.register('mobile', Mobile);

})(Planner.Plugins, Planner.Utils);
