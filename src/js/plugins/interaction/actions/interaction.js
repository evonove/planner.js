(function (Interaction, Utils, undefined) {
  'use strict';

  var Mixin = {};

  Mixin.startInteraction = function (type, card, element, index, y) {
    // Store variables for further interactions
    this.currentInteraction = type;
    this.currentCard = card;
    this.currentElement = element;
    this.initialIndex = index;
    this.initialY = y;
  };

  Mixin.stopInteraction = function () {
    // Publish card dom creation
    this.planner.events.publish('cardDomDrawn', [this.currentCard, this.currentElement]);

    this.currentInteraction = null;
    this.currentCard = null;
    this.currentElement = null;
    this.initialIndex = null;
    this.initialY = null;
  };

  // Mixin for Interaction
  // ------------------

  Interaction.prototype = Utils.extend(Interaction.prototype, Mixin);

})(Planner.Plugins.Interaction, Planner.Utils);
