(function (Interaction, Utils, undefined) {
  'use strict';

  var Mixin = {};

  Mixin.cardClick = function (card, element) {
    if (card.fixed) {
      return;
    }

    element.addEventListener('click', this.mouseClick.bind(this, card, element));
  };

  Mixin.mouseClick = function (card, element, event) {
    // Avoid this action on event propagation from children or if
    // another interaction is active
    var timeElement = element.children[0]
      , titleElement = element.children[1];

    if ((event.target === element || event.target === timeElement || event.target === titleElement) && this.currentInteraction === null) {
      this.planner.events.publish('cardClicked', [card, element]);
    }

    event.stopPropagation();
  };

  Mixin.mouseDown = function (event) {
    // Avoid this action on event propagation from children
    if (event.currentTarget === event.target) {
      // Start interaction with created objects
      var card = this.createCard(event.target);
      this.planner.drawCard(card);

      // TODO: fix me
      // Utils.index(this) doesn't match strictly domId. After full migration to data-attribute,
      // we can use this value to find the correct domId
      var domId = card.columns[0];
      this.startInteraction('dragCreation', card, this.planner.mapCard.get(card)[domId], Utils.index(event.target), event.clientY);
      event.preventDefault();
    }
  };

  Mixin.mouseDownResize = function (card, element, event) {
    this.startInteraction('resize', card, element, this.planner._attributeToIndex(card.start), Utils.offset(element).top - document.body.scrollTop);
    Utils.addClass(this.currentElement, 'resizable');

    event.preventDefault();
  };

  Mixin.mouseMove = function (event) {
    if (this.currentInteraction === 'dragCreation' || this.currentInteraction === 'resize') {
      this.resize(event.clientY);

      event.preventDefault();
    }
  };

  Mixin.mouseUp = function (event) {
    // TODO: remove this condition because this way is terribly WRONG and UGLY!
    if (this.currentInteraction === 'dragCreation') {
      this.planner.events.publish('cardCreated', [this.currentCard, this.currentElement]);

      this.stopInteraction();
      event.preventDefault();
    } else if (this.currentInteraction === 'resize') {
      if (this.currentCard.columns.length > 1) {
        // Redraw other dom objects
        var doms = this.planner.mapCard.get(this.currentCard);
        for (var key in doms) {
          if (doms.hasOwnProperty(key)) {
            this.planner.updateDom(doms[key], this.currentCard);
            this.planner.events.publish('cardDomDrawn', [this.currentCard, doms[key]]);
          }
        }
      }

      // Removes extra styles
      Utils.removeClass(this.currentElement, 'resizable');

      this.planner.events.publish('cardUpdated', [this.currentCard, this.currentElement]);
      this.stopInteraction();
      event.preventDefault();
    }
  };

  // Mixin for Interaction
  // ------------------

  Interaction.prototype = Utils.extend(Interaction.prototype, Mixin);

})(Planner.Plugins.Interaction, Planner.Utils);
