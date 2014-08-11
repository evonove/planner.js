(function (Interaction, Utils, undefined) {
  'use strict';

  var Mixin = {};

  Mixin.drag = function (destination) {
    // Rearrange collisions in source column
    this.planner.events.publish('/card/actions/dragged', [this.currentCard, this.currentElement, true]);

    // Append current element to dragged position
    destination.appendChild(this.currentElement);

    // Calculate new values
    var length = this.currentElement.getAttribute('data-end') - this.currentElement.getAttribute('data-start')
      , column = Utils.index(this.currentElement.parentNode.parentNode) + 1
      , startPosition = Utils.index(this.currentElement.parentNode);

    // Update Card and DOM object
    this.currentCard.update({
      columns: [column],
      start: this.planner._indexToAttribute(startPosition),
      end: this.planner._indexToAttribute(startPosition + length + 1)
    });

    Utils.removeClass(this.currentElement, 'dragged');
    this.planner.updateDom(this.currentElement, this.currentCard, column);

    // Removes dashed effects when element is dropped and updated
    this.resetDashedDom();
  };

  Mixin.resetDashedDom = function () {
    while (this.listReduced.length > 0) {
      Utils.removeClass(this.listReduced.pop(), 'card-dashed');
    }
  };

  Mixin.dragHandlers = function(card, element) {
    if (card.columns.length > 1) {
      // Remove all drag listeners
    } else {
      // Append all drag listeners
    }
  };

  // Mixin for Interaction
  // ------------------

  Interaction.prototype = Utils.extend(Interaction.prototype, Mixin);

})(Planner.Plugins.Interaction, Planner.Utils);
