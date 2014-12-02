(function (Plugins, Utils, undefined) {
  'use strict';

  // Plugin constructor and defaults
  // -------------------------------

  var Mobile = function (element, options) {
    var context = {
      widths: {
        phone: {
          landscape: 100 / options.mobileVisibleColumns.phone.landscape,
          portrait: 100 / options.mobileVisibleColumns.phone.portrait
        },
        tablet: {
          landscape: 100 / options.mobileVisibleColumns.tablet.landscape,
          portrait: 100 / options.mobileVisibleColumns.tablet.portrait
        }
      }
    };

    // Add mobile styles
    document.querySelector('head').appendChild(Utils.createElement(Planner.Templates.mobile(context)));
  };

  Mobile.DEFAULTS = {
    mobileVisibleColumns: {
      phone: {
        landscape: 2,
        portrait: 1
      },
      tablet: {
        landscape: 5,
        portrait: 3
      }
    }
  };

  // Register this plugin to plugins list
  // ------------------------------------

  Plugins.register('mobile', Mobile);

})(Planner.Plugins, Planner.Utils);
