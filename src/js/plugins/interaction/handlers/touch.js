(function (Interaction, Events, Utils, undefined) {
  'use strict';

  var Mixin = {};

  Mixin.touchMove = function (event) {
    if (this.currentCard !== null) {
      this.resize(event.touches[0].clientY);
      event.preventDefault();
    }
  };

  Mixin.touchEnd = function (event) {
    Events.publish('cardCreated', [this.currentCard, this.currentElement]);

    this.stopInteraction();
    event.preventDefault();
  };

  Mixin.touchTap = function (card, element) {
    var touchEnd = function () {
      Events.publish('cardClicked', [card, element]);
      // TODO: check if this is required to "Avoid propagation of element on child/parent elements"
      // event.stopPropagation();
    };

    element.addEventListener('touchend', touchEnd);
  };

  // Mixin for Interaction
  // ------------------

  Interaction.prototype = Utils.extend(Interaction.prototype, Mixin);

})(Planner.Plugins.Interaction, Planner.Events, Planner.Utils);
