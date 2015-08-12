(function (Interaction, Templates, Utils, undefined) {
  'use strict';

  var Mixin = {};

  Mixin.addResizeDom = function (card, element) {
    if (card.fixed) {
      return;
    }

    var resizableDom = Utils.createElement(Templates.drag({dragComponent: this.options.dragComponent}))
      , cardDomTitle = element.querySelectorAll('.planner-card-title');

    // Append element after latest DOM object of a Card
    for (var i = 0; i < cardDomTitle.length; i++) {
      cardDomTitle[i].parentNode.appendChild(resizableDom);
    }

    resizableDom.addEventListener('mousedown', this.mouseDownResize.bind(this, card, element));
  };

  Mixin.resize = function (pointerY) {
    // Calculate new length
    var currentCardPosition = Math.floor((pointerY - this.initialY) / this.options.timeslotHeight)
      , endAttribute = this.planner._indexToAttribute(this.initialIndex + currentCardPosition + 1);

    // Avoid negative values (end < start) during resize
    if (currentCardPosition >= 0) {
      this.currentCard.update({end: Utils.updateDate(this.currentCard.end, endAttribute.hours, endAttribute.minutes)});
      this.planner.updateDom(this.currentElement, this.currentCard);
    }
  };

  // Mixin for Interaction
  // ------------------

  Interaction.prototype = Utils.extend(Interaction.prototype, Mixin);

})(Planner.Plugins.Interaction, Planner.Templates, Planner.Utils);
