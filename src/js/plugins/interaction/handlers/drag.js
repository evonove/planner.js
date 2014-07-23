(function (Interaction, Utils, undefined) {
  'use strict';

  var Mixin = {};

  Mixin.dragOver = function (event) {
    event.preventDefault();
  };

  Mixin.drop = function (event) {
    this.drag(event.currentTarget);
    this.stopInteraction();
    event.preventDefault();

    this.planner.events.publish('cardUpdated', [this.currentCard, this.currentElement]);
  };

  Mixin.dragCard = function (card, element) {
    element.setAttribute('draggable', true);

    // TODO: refactoring of this handler is needed
    var that = this;

    var dragStart = function (event) {
      // Start interaction with created objects
      that.startInteraction('dragMove', card, element);

      // Required for Firefox
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', '[Object] Card');
      event.dataTransfer.setDragImage(this, 20, 20);

      // Add a ghost effect
      Utils.addClass(element, 'dragging');
    };

    var dragEnter = function () {
      // Reduce card size if draggedElement goes upfront another card
      // and store the node to remove this effect later
      if (!Utils.hasClass(element, 'card-small')) {
        Utils.addClass(element, 'card-small');
        that.listReduced.push(element);
      }
    };

    var drop = function (event) {
      // Avoid to drop a card over another card
      event.preventDefault();
      that.resetReducedDom();
    };

    var dragEnd = function () {
      // Remove ghost effect
      Utils.removeClass(element, 'dragging');
      that.resetReducedDom();
    };

    element.addEventListener('dragstart', dragStart);
    element.addEventListener('dragenter', dragEnter);
    element.addEventListener('drop', drop);
    element.addEventListener('dragend', dragEnd);
  };

  // Mixin for Interaction
  // ------------------

  Interaction.prototype = Utils.extend(Interaction.prototype, Mixin);

})(Planner.Plugins.Interaction, Planner.Utils);
