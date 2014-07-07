;(function(Instance, Utils, undefined) { 'use strict';

  var Mixin = {};

  // Card and DOM operations
  // -----------------------

  Mixin.drawCard = function(card) {
    var _cardDom;
    var _cachedDomList = this.mapCard.get(card);

    // Object assignment to a global hash map if it has been never initialized
    if (typeof _cachedDomList === 'undefined') {
      _cachedDomList = {};
      this.mapCard.put(card, _cachedDomList);
    }

    for (var i = 0; i< card.columns.length; i++) {
      var column = card.columns[i];

      // Check if DOM was already drawn in the past otherwise return old instance
      _cardDom = _cachedDomList[column];
      if (typeof _cardDom === 'undefined') {
        _cardDom = Utils.createElement(Planner.Templates.card(card));
        this.updateDom(_cardDom, card, column);

        // Bidirectional mapping between Card and DOM object using a key/value
        // literal to store all DOM objects
        this.mapDom.put(_cardDom, card);
        _cachedDomList[column] = _cardDom;
      }

      this._drawDom(_cardDom);
    }

    Planner.Events.publish('cardDrawn', [card]);
  };

  Mixin._drawDom = function(cardDom) {
    // Get data-attributes element from card DOM
    // TODO: provide an utility for a better data attribute access
    var dataColumn = parseInt(cardDom.getAttribute('data-column'), 10);
    var dataStart = parseInt(cardDom.getAttribute('data-start'), 10);

    // TODO: this function doesn't support multi day events and collisions
    // Find the right column and search starting div to append created object
    // Note: (start + 1) is used because of CSS selector and not because index() function
    this.element.querySelector('.planner-column:nth-child(' + dataColumn + ') > div:nth-child(' + (dataStart + 1) + ')').appendChild(cardDom);
    Planner.Events.publish('cardDomDrawn', [this.mapDom.get(cardDom), cardDom]);
  };

  Mixin.updateDom = function(dom, card, column) {
      var start = this._attributeToIndex(card.start);
      var end = this._attributeToIndex(card.end) - 1;

      // TODO: corner case for last timeslot caused by not managing multiple days
      if (end < 0) {
          end = this.options.timeslots * this.options.rowLabels.length - 1;
      }

      if (start <= end) {
          var cardLength = (end - start + 1) * this.options.timeslotHeight - this.options.cardTitleMargin;

          // Update data attributes
          // TODO: use a Data warehouse like one explained here (http://jsperf.com/data-dataset) for a better performance
          if (typeof column !== 'undefined')  {
              dom.setAttribute('data-column', column);
          }

          dom.setAttribute('data-start', start);
          dom.setAttribute('data-end', end);

          // Update DOM attributes
          dom.querySelector('.planner-card-time').innerhtml = card.header;

          dom.style.height = cardLength + 'px';
      }
  };

  // Mixin for Instance
  // ------------------

  Instance.prototype = Utils.extend(Instance.prototype, Mixin);

//    TODO: disabled for now
//    Helpers.removeDom = function(cachedDomList, cardId) {
//         var cardDom = cachedDomList[cardId];
//
//         _undrawDom.apply(this, [cardDom]);
//
//         // Removing all bidirectional mapping
//         delete cachedDomList[cardId];
//         Planner.mapDom.remove(cardDom);
//         Planner.Events.publish('cardDomDeleted', [this, cardDom]);
//    };

//    TODO: disabled for now
//    Helpers.undrawDom = function(cardDom) {
//        // Remove Card column representation from the DOM
//        cardDom.remove();
//        Planner.Events.publish('cardDomUndrawn', [this, cardDom]);
//    };

//    TODO: disabled for now
//    Helpers.clearDomCache = function(cachedDomList) {
//        // Clear all cached objects
//        for (var cardId in cachedDomList) {
//            if (cachedDomList.hasOwnProperty(cardId)) {
//                _removeDom.apply(this, [cachedDomList, cardId]);
//            }
//        }
//    };

//    TODO: disabled for now
//    Planner.Instance.prototype.undrawCard = function(card) {
//        var _cachedDomList = Planner.mapCard.get(this);
//        var _cardDom;
//
//        // Undraw all related DOM objects
//        for (var cardId in _cachedDomList) {
//            if (_cachedDomList.hasOwnProperty(cardId)) {
//                _cardDom = _cachedDomList[cardId];
//                _undrawDom.apply(this, [_cardDom]);
//            }
//        }
//
//        Planner.Events.publish('cardUndrawn', [this]);
//    };

//    TODO: disabled for now
//    Planner.Instance.prototype.removeCard = function(card) {
//        var _cachedDomList = Planner.mapCard.get(this);
//
//        // Removing all mappings
//        _clearDomCache.apply(this, [_cachedDomList]);
//        Planner.mapCard.remove(this);
//        Planner.Events.publish('cardDeleted', [this]);
//    };

})(Planner.Instance = Planner.Instance || {}, Planner.Utils);
