(function (Interaction, Utils, undefined) {
  'use strict';

  var Mixin = {};

  Mixin.startInteraction = function (type, card, element, index, y) {
    // Store variables for further interactions
    this.currentInteraction = type;
    this.currentCard = card;
    this.currentElement = element;
    this.currentColumn = element.parentElement.parentElement;
    this.initialIndex = index;
    this.initialY = y;

    this.planner.events.publish('/card/interaction/starts', [type]);
  };

  Mixin.stopInteraction = function () {
    // Clear all styles (useful after collisions)
    this.currentElement.style.width = '';
    this.currentElement.style.left = '';

    // Publish interaction end
    this.planner.events.publish('/card/interaction/ends', [this.currentInteraction]);

    this.currentInteraction = null;
    this.currentCard = null;
    this.currentElement = null;
    this.currentColumn = null;
    this.initialIndex = null;
    this.initialY = null;
  };

  // Mixin for Interaction
  // ------------------

  Interaction.prototype = Utils.extend(Interaction.prototype, Mixin);

})(Planner.Plugins.Interaction, Planner.Utils);
