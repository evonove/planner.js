(function (Instance, Utils, HashMap, undefined) {
  'use strict';

  var Mixin = {};

  // Card and DOM operations
  // -----------------------

  Mixin.drawCard = function (card) {
    var _cardDom
      , _cachedDomList = this.mapCard.get(card);

    if (typeof _cachedDomList !== 'undefined') {
      // If this card has been already drawn, do nothing
      return;
    }

    _cachedDomList = {};
    this.mapCard.put(card, _cachedDomList);

    for (var i = 0; i < card.columns.length; i++) {
      var column = card.columns[i];

      _cardDom = Utils.createElement(Planner.Templates.card(card));
      this.updateDom(_cardDom, card, column);

      // Bidirectional mapping between Card and DOM object using a key/value
      // literal to store all DOM objects
      this.mapDom.put(_cardDom, card);
      _cachedDomList[column] = _cardDom;

      this._drawDom(_cardDom);
    }

    this.events.publish('cardDrawn', [card]);
  };

  Mixin._drawDom = function (cardDom) {
    // Get data-attributes element from card DOM
    var dataColumn = parseInt(cardDom.getAttribute('data-column'), 10);
    var dataStart = parseInt(cardDom.getAttribute('data-start'), 10);

    // Using column id data-attribute to find the correct index;
    // useful if dataColumn represents a database 'id'
    var columnIndex = Utils.index(this.element.querySelector('[data-column-id="' + dataColumn + '"]')) + 1;

    // TODO: this function doesn't support multi day events and collisions
    this.element.querySelector('.planner-column:nth-child(' + columnIndex + ') > div:nth-child(' + (dataStart + 1) + ')').appendChild(cardDom);
    this.events.publish('cardDomDrawn', [this.mapDom.get(cardDom), cardDom]);
  };

  Mixin.updateDom = function (dom, card, column) {
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
      if (typeof column !== 'undefined') {
        dom.setAttribute('data-column', column);
      }

      dom.setAttribute('data-id', card.id);
      dom.setAttribute('data-start', start);
      dom.setAttribute('data-end', end);

      // Update DOM attributes
      dom.querySelector('.planner-card-time').innerHTML = card.header();

      dom.style.height = cardLength + 'px';
    }
  };

  Mixin._removeDom = function(dom) {
    dom.parentNode.removeChild(dom);

    // Removing all bidirectional mapping
    var card = this.mapDom.get(dom);
    var domList = this.mapCard.get(card);

    delete domList[parseInt(dom.getAttribute('data-column'), 10)];
    this.mapDom.remove(dom);

    this.events.publish('cardDomDeleted', [card, dom]);
  };

  Mixin.undrawCard = function(card) {
    var domList = this.mapCard.get(card)
      , dom;

    for (var key in domList) {
      if (domList.hasOwnProperty(key)) {
        dom = domList[key];
        this._removeDom(dom);
      }
    }

    // Removing all mappings
    this.mapCard.remove(card);
    this.events.publish('cardDeleted', [this]);
  };

  Mixin.clear = function() {
    // TODO: warning
    // this is a shortcut to remove all cards without too much computation;
    // this method isn't under MEM profiling and it's possible that it can
    // cause useless memory waste

    var domElement = document.querySelectorAll('.planner-card')
      , dom;

    for (var i = 0; i < domElement.length; i++) {
      dom = domElement[i];
      dom.parentNode.removeChild(dom);
    }

    // Logic delete waiting for the garbage collector to do the rest
    this.mapCard = new HashMap();
    this.mapDom = new HashMap();
  };

  // Mixin for Instance
  // ------------------

  Instance.prototype = Utils.extend(Instance.prototype, Mixin);

})(Planner.Instance = Planner.Instance || {}, Planner.Utils, Ds.HashMap);
