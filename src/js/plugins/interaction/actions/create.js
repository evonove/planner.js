(function (Interaction, Helpers, Utils, undefined) {
  'use strict';

  var Mixin = {};

  Mixin.createCard = function (element) {
    var startAttribute = this.planner._indexToAttribute(Utils.index(element))
      , endAttribute = this.planner._indexToAttribute(Utils.index(element) + 1)
      , column = [parseInt(element.parentElement.getAttribute('data-column-id'), 10)]
      , cardId = null;

    if (this.options.autoId) {
      cardId = Helpers.generateId(this.options);
    }

    if (isNaN(column)) {
      return null;
    } else {
      return this.options.model({id: cardId, start: startAttribute, end: endAttribute, columns: column});
    }
  };

  // Mixin for Interaction
  // ------------------

  Interaction.prototype = Utils.extend(Interaction.prototype, Mixin);

})(Planner.Plugins.Interaction, Planner.Helpers, Planner.Utils);
