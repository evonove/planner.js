(function (Interaction, Utils, undefined) {
  'use strict';

  var Mixin = {};

  // Attach interaction to destination objects
  Mixin.dragOver = function (event) {
    event.preventDefault();
  };

  Mixin.drop = function (event) {
    this.drag(event.currentTarget);
    this.planner.events.publish('cardUpdated', [this.currentCard, this.currentElement]);

    this.stopInteraction();
    event.preventDefault();
  };

  Mixin.dragChangeColumn = function (event) {
    // Removes all dashed effects when you change the column
    // TODO: this behaviour can be enhanced
    if (event.currentTarget.parentElement !== this.currentColumn) {
      this.currentColumn = event.currentTarget.parentElement;
      this.resetDashedDom();
    }
  };

  // Attach interaction to source object
  Mixin.dragCard = function (card, element) {
    var that = this;

    // Add draggable for native browsers
    element.setAttribute('draggable', true);

    var dragStart = function (event) {
      if (card.columns.length > 1) {
        // Don't allow card drag on multi-column events
        event.preventDefault();
      } else {
        that.startInteraction('dragMove', card, element);
        Utils.addClass(element, 'dragged');

        // Required for Firefox
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', element.outerHTML);
        event.dataTransfer.setDragImage(element, 5, 10);
      }
    };

    var dragOver = function () {
      // Puts hovered card behind the planner so it's possible to
      // drop dragged card on it
      if (!Utils.hasClass(element, 'card-dashed')) {
        Utils.addClass(element, 'card-dashed');
        that.listReduced.push(element);
      }
    };

    element.addEventListener('dragstart', dragStart);
    element.addEventListener('dragover', dragOver);
  };

  // Mixin for Interaction
  // ------------------

  Interaction.prototype = Utils.extend(Interaction.prototype, Mixin);

})(Planner.Plugins.Interaction, Planner.Utils);
