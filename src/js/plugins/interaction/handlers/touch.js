(function (Interaction, Utils, undefined) {
  'use strict';

  var timer;
  var timeoutHold = 300;
  var currentX = 0;
  var currentY = 0;

  var Mixin = {};

  Mixin.touchPress = function (event) {
    var that = this;
    var domId;
    var card;

    timer = setTimeout(press, timeoutHold);

    function press () {
      card = that.createCard(event.target);
      that.planner.drawCard(card);

      // TODO: fix me
      // Utils.index(this) doesn't match strictly domId. After full migration to data-attribute,
      // we can use this value to find the correct domId
      domId = card.columns[0];
      that.startInteraction('dragCreation', card, that.planner.mapCard.get(card)[domId], Utils.index(event.target), event.touches[0].clientY);
    }
  };

  Mixin.touchMove = function (event) {
    if (timer) {
      clearTimeout(timer);
    }

    var touch = event.touches[0];
    currentX = touch.pageX;
    currentY = touch.pageY;

    if (this.currentCard !== null) {
      this.resize(event.touches[0].clientY);
      event.preventDefault();
    }
  };

  Mixin.touchEnd = function () {
    if (timer) {
      clearTimeout(timer);
    }

    if (this.currentCard !== null) {
      this.planner.events.publish('cardCreated', [this.currentCard, this.currentElement]);
      this.stopInteraction();
    }
  };

  Mixin.touchTap = function (card, element) {
    var that = this;

    element.addEventListener('touchstart', detectTap);

    function detectTap (event) {
      var touch = event.touches[0];
      var eventX = currentX = touch.pageX;
      var eventY = currentY = touch.pageY;

      setTimeout(function () {
        if ((eventX === currentX) && (eventY === currentY)) {
          that.planner.events.publish('cardClicked', [card, element]);
        }
      }, timeoutHold);
    }
  };

  // Mixin for Interaction
  // ---------------------

  Interaction.prototype = Utils.extend(Interaction.prototype, Mixin);

})(Planner.Plugins.Interaction, Planner.Utils);
