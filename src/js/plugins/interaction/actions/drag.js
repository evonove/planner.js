(function (Interaction, Utils, undefined) {
  'use strict';

  var Mixin = {};

  Mixin.drag = function (destination) {
    // Appends current element to dragged position
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

    this.planner.updateDom(this.currentElement, this.currentCard, column);
  };

  Mixin.resetReducedDom = function () {
    while (this.listReduced.length > 0) {
      Utils.removeClass(this.listReduced.pop(), 'card-small');
    }
  };

  // Mixin for Interaction
  // ------------------

  Interaction.prototype = Utils.extend(Interaction.prototype, Mixin);

})(Planner.Plugins.Interaction, Planner.Utils);
