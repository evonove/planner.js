(function (Model, Models, undefined) {
  'use strict';

  // Class definition
  // ----------------

  var fields = [
    'id',
    'title',
    'content',
    'start',
    'end',
    'columns'
  ];

  var methods = {
    header: getHeaderDateTime,
    update: update
  };

  Models.Card = new Model(fields, methods);

  // Methods implementation
  // ----------------------

  /**
   * @name getHeaderDateTime
   * @returns {string}
   */
  function getHeaderDateTime () {
    var title = '';

    // TODO: it should be generic and must works even for simple strings
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

})(window.Model, Planner.Models = Planner.Models || {});
