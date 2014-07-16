(function (Interaction, Utils, undefined) {
  'use strict';

  var Mixin = {};

  Mixin.createCard = function (element) {
    var startAttribute = this.planner._indexToAttribute(Utils.index(element))
      , endAttribute = this.planner._indexToAttribute(Utils.index(element) + 1)
      , column = [Utils.index(element.parentNode) + 1];

    return this.options.model({start: startAttribute, end: endAttribute, columns: column});
  };

  // Mixin for Interaction
  // ------------------

  Interaction.prototype = Utils.extend(Interaction.prototype, Mixin);

})(Planner.Plugins.Interaction, Planner.Utils);
