(function (Models, undefined) {
  'use strict';

  // Card class definition
  // ---------------------

  Models.Card = function (attrs) {
    var object = {};

    // Base attributes
    object.id = attrs.id || null;
    object.title = attrs.title || null;
    object.content = attrs.content || null;
    object.start = attrs.start || null;
    object.end = attrs.end || null;
    object.columns = attrs.columns || [];

    // Computed properties
    Object.defineProperty(object, 'header', {get: _generateHeader});

    // Public methods
    object.update = _update;

    return object;
  };

  // Private methods
  // ---------------

  var _generateHeader = function () {
    var title = '';

    // TODO: it should be generic and must works even for simple strings
    if (this.start !== null && this.end !== null) {
      if (typeof this.start.getHours === 'function' && typeof this.start.getMinutes === 'function' && typeof this.end.getHours === 'function' && typeof this.end.getMinutes === 'function') {
        title = Planner.Utils.pad(this.start.getHours()) + ':' + Planner.Utils.pad(this.start.getMinutes()) + ' - ' + Planner.Utils.pad(this.end.getHours()) + ':' + Planner.Utils.pad(this.end.getMinutes());
      } else if (this.start === this.end) {
        title = this.start;
      } else {
        title = this.start + '-' + this.end;
      }
    }

    return title;
  };

  var _update = function (attrs) {
    this.id = attrs.id || this.id;
    this.title = attrs.title || this.title;
    this.content = attrs.content || this.content;
    this.start = attrs.start || this.start;
    this.end = attrs.end || this.end;
    this.columns = attrs.columns || this.columns;
  };

})(Planner.Models = Planner.Models || {});
