(function (Planner, undefined) {
  'use strict';

  // Defines Planner.js instance
  // ---------------------------

  Planner.Instance = function (element, options) {
    this.element = element;
    this.options = options;

    // Initialize HashMaps to store planner Card status
    this.mapCard = new HashMap();
    this.mapDom = new HashMap();

    // Check if columns and rows are set otherwise use a default planner
    if (options.columnLabels.length === 0) {
      options.columnLabels = Planner.Helpers.getDefaultColumns();
    }

    if (options.rowLabels.length === 0) {
      options.rowLabels = Planner.Helpers.getDefaultRows();
    }

    // Edit some properties
    options.visibleColumns = options.visibleColumns > options.columnLabels.length ? options.columnLabels.length : options.visibleColumns;
    element.setAttribute('data-planner', 'container');

    // Initialize planner template only if required
    // TODO: better implementation required
    if (options.show) {
      this.element.innerHTML = Planner.Templates.body(options);
    }

    // Append all computed CSS
    var head = document.querySelector('head');
    head.appendChild(this._computedCSS());

    // Load attached plugins
    Planner.Plugins.load(options.plugins, this);
  };

})(window.Planner = window.Planner || {});
