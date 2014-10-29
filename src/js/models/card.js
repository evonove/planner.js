(function (Models, undefined) {
  'use strict';

  // Defaults
  // --------

  var _DEFAULTS = {
    id: null,
    title: null,
    content: null,
    start: null,
    end: null,
    columns: []
  };

  // Card constructor
  // ----------------

  /**
   * @name Card
   * @param attrs
   * @returns {object}
   * @constructor
   */
  function Card (attrs) {
    var object = {};

    // Base attributes
    attrs = attrs || {};

    object.id = attrs.id || _DEFAULTS.id;
    object.title = attrs.title || _DEFAULTS.title;
    object.content = attrs.content || _DEFAULTS.content;
    object.start = attrs.start || _DEFAULTS.start;
    object.end = attrs.end || _DEFAULTS.end;
    object.columns = attrs.columns || _DEFAULTS.columns;

    object.header = getHeaderDateTime;
    object.update = update;

    return object;
  }

  // Methods
  // -------

  /**
   * @name getHeaderDateTime
   * @returns {string}
   */
  function getHeaderDateTime () {
    // TODO: it should be generic and must works even for simple strings
    var title = '';

    if (this.start !== null && this.end !== null) {
      title = Planner.Utils.pad(this.start.getHours()) + ':'
        + Planner.Utils.pad(this.start.getMinutes()) + ' - '
        + Planner.Utils.pad(this.end.getHours()) + ':'
        + Planner.Utils.pad(this.end.getMinutes());
    }

    return title;
  }

  /**
   * @name update
   * @param attrs
   */
  function update (attrs) {
    this.id = attrs.id || this.id;
    this.title = attrs.title || this.title;
    this.content = attrs.content || this.content;
    this.start = attrs.start || this.start;
    this.end = attrs.end || this.end;
    this.columns = attrs.columns || this.columns;
  }

  Models.Card = Card;

})(Planner.Models = Planner.Models || {});
