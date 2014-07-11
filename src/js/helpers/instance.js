(function (Instance, Utils, undefined) {
  'use strict';

  var Mixin = {};

  // CSS helpers
  // -----------

  // Generate a computed style node
  Mixin._computedCSS = function () {
    var timeslotSize = this.options.timeslotHeight * this.options.timeslots;
    var timeslotPadding = this.options.centered ? timeslotSize / 2 : timeslotSize;

    var cssContext = {
      timeslots: this.options.timeslots,
      timeslotHeight: this.options.timeslotHeight,
      timeslotPadding: timeslotSize - this.options.timeslotPadding,
      lastTimeslotPadding: timeslotPadding,
      sliderWidth: 100 / this.options.visibleColumns
    };

    var style = document.createElement('style');
    style.innerHTML = Planner.Templates.styles(cssContext);
    return style;
  };

  // Attributes finder
  // -----------------

  // Transform start or end attributes to a valid planner interval (index) according to attribute type
  Mixin._attributeToIndex = function (attribute) {
    var index;

    if (typeof attribute.getHours === 'function' && typeof attribute.getMinutes === 'function') {
      index = attribute.getHours() * this.options.timeslots + attribute.getMinutes() / (60 / this.options.timeslots);
    } else if (typeof attribute === 'string') {
      index = this.options.rowLabels.indexOf(attribute);
    } else {
      throw new Error('Unable to find a valid index from start/end card attribute. Define your own implementation.');
    }

    return index;
  };

  // Transform element index to a valid card start/end object
  Mixin._indexToAttribute = function (index) {
    var attribute;

    // Convert date time object
    var hours = Math.floor((index - 1) / this.options.timeslots);
    var minutes = 15 * (index % this.options.timeslots);

    if (minutes === index % this.options.timeslots) {
      hours += 1;
    }

    // TODO: missing conversion from string object (ex: 'lunch')
    attribute = new Date();
    attribute.setHours(hours);
    attribute.setMinutes(minutes);
    attribute.setSeconds(0);

    return attribute;
  };

  // Mixin for Instance
  // ------------------

  Instance.prototype = Utils.extend(Instance.prototype, Mixin);

})(Planner.Instance = Planner.Instance || {}, Planner.Utils);
