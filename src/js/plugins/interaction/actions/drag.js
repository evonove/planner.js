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
      , column = parseInt(this.currentElement.parentElement.parentElement.getAttribute('data-column-id'), 10)
      , startPosition = Utils.index(this.currentElement.parentNode);

    // Update Card and DOM object
    var startAttribute = this.planner._indexToAttribute(startPosition)
      , endAttribute = this.planner._indexToAttribute(startPosition + length + 1)
      , newStart = Utils.updateDate(this.currentCard.start, startAttribute.hours, startAttribute.minutes)
      , newEnd = Utils.updateDate(this.currentCard.end, endAttribute.hours, endAttribute.minutes);

    this.currentCard.update({
      columns: [column],
      start: newStart,
      end: newEnd
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

  // Mixin for Interaction
  // ------------------

  Interaction.prototype = Utils.extend(Interaction.prototype, Mixin);

})(Planner.Plugins.Interaction, Planner.Utils);
