(function (Interaction, Utils, undefined) {
  'use strict';

  var Mixin = {};

  // Attach interaction to destination objects
  Mixin.dragOver = function (event) {
    event.preventDefault();
  };

  Mixin.drop = function (event) {
    this.drag(event.currentTarget);
    this.stopInteraction();
    this.planner.events.publish('cardUpdated', [this.currentCard, this.currentElement]);

    event.preventDefault();
  };

  // Attach interaction to source object
  Mixin.dragCard = function (card, element) {
    var that = this;

    // Add draggable for native browsers
    element.setAttribute('draggable', true);

    var dragStart = function (event) {
      that.startInteraction('dragMove', card, element);
      Utils.addClass(element, 'dragged');

      // Required for Firefox
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', element.outerHTML);
      event.dataTransfer.setDragImage(element, 5, 10);
    };

    element.addEventListener('dragstart', dragStart);
  };

  // Mixin for Interaction
  // ------------------

  Interaction.prototype = Utils.extend(Interaction.prototype, Mixin);

})(Planner.Plugins.Interaction, Planner.Utils);
