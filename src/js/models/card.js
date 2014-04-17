;(function(Planner, undefined) { 'use strict';

    // Private methods
    // ---------------

    var _generateHeader = function() {
        var title = '';

        if (this.start !== null && this.end !== null) {
            if (typeof this.start.getHours === 'function' && typeof this.start.getMinutes === 'function' && typeof this.end.getHours === 'function' && typeof this.end.getMinutes === 'function') {
                title = Planner.Utils.pad(this.start.getHours()) + ':' + Planner.Utils.pad(this.start.getMinutes()) + ' - ' + Planner.Utils.pad(this.end.getHours()) + ':' + Planner.Utils.pad(this.end.getMinutes());
            } else if (this.start === this.end) {
                title = this.start;
            } else {
                title = this.start + '-' + this.end;
            }
        }

        return title;
    };

    var _updateDom = function($element, column) {
        var options = Planner.options;
        var start = Planner.Helpers.attributeToIndex(this.start);
        var end = Planner.Helpers.attributeToIndex(this.end) - 1;

        // TODO: corner case for last timeslot caused by not managing multiple days
        if (end < 0) {
            end = options.timeslots * options.rowLabels.length - 1;
        }

        if (start <= end) {
            var cardLength = (end - start + 1) * options.timeslotHeight - options.cardTitleMargin;

            // Update data attributes
            // TODO: use a Data warehouse like one explained here (http://jsperf.com/data-dataset) for a better performance
            if (typeof column !== 'undefined')  {
                $element.get(0).setAttribute('data-column', column);
            }

            $element.get(0).setAttribute('data-start', start);
            $element.get(0).setAttribute('data-end', end);

            // Update DOM attributes
            $element.find('.planner-card-time').html(this.header);
            $element.height(cardLength);
        }
    };

    var _refresh = function(attrs) {
        this.id = attrs.id || this.id;
        this.title = attrs.title || this.title;
        this.content = attrs.content || this.content;
        this.start = attrs.start || this.start;
        this.end = attrs.end || this.end;
        this.columns = attrs.columns || this.columns;
    };

    var _clearDomCache = function(cachedDomList) {
      var _cardDom;

      // Clear all cached objects
      for (var cardId in cachedDomList) {
        if (cachedDomList.hasOwnProperty(cardId)) {
          _cardDom = cachedDomList[cardId];
          _removeDom.apply(this, [cachedDomList, _cardDom]);
        }
      }
    };

    // Card and DOM draw/undraw methods
    // --------------------------------

    var _drawCard = function() {
        var _cachedDomList = Planner.mapCard.get(this);
        var _cardDom;

        this.columns.forEach(function(column) {
            // Check if DOM was already drawn in the past otherwise return old instance
            _cardDom = _cachedDomList[column];
            if (typeof _cardDom === 'undefined') {
                _cardDom = _createDomElement.apply(this, [_cachedDomList, column]);
            }

            _drawDom.apply(this, [_cardDom]);
        }.bind(this));

        Planner.Events.publish('cardDrawn', [this]);
    };

    var _createDomElement = function(cachedDomList, column) {
        // Generate a standard Card DOM object
        var cardDom = $(Planner.Templates.card(this));
        _updateDom.apply(this, [cardDom, column]);

        // Bidirectional mapping between Card and DOM object using a key/value
        // literal to store all DOM objects
        Planner.mapDom.put(cardDom, this);
        cachedDomList[column] = cardDom;

        return cardDom;
    };

    var _drawDom = function(cardDom) {
        // Get data-attributes element from card DOM
        // TODO: provide an utility for a better data attribute access
        var dataColumn = parseInt(cardDom.get(0).getAttribute('data-column'), 10);
        var dataStart = parseInt(cardDom.get(0).getAttribute('data-start'), 10);

        // TODO: this function doesn't support multi day events and collisions
        // Find the right column and search starting div to append created object
        // Note: (start + 1) is used because of CSS selector and not because index() function
        Planner.$element.find('.planner-column:nth-child(' + dataColumn + ') > div:nth-child(' + (dataStart + 1) + ')').append(cardDom);
        Planner.Events.publish('cardDomDrawn', [this, cardDom]);
    };

    var _undrawCard = function() {
      var _cachedDomList = Planner.mapCard.get(this);
      var _cardDom;

      // Undraw all related DOM objects
      for (var cardId in _cachedDomList) {
        if (_cachedDomList.hasOwnProperty(cardId)) {
          _cardDom = _cachedDomList[cardId];
          _undrawDom.apply(this, [_cardDom]);
        }
      }

      Planner.Events.publish('cardUndrawn', [this]);
    };

    var _undrawDom = function(cardDom) {
      // Remove Card column representation from the DOM
      cardDom.remove();
      Planner.Events.publish('cardDomUndrawn', [this, cardDom]);
    };

    // Card and DOM data structure operations
    // --------------------------------------

    var _removeCard = function() {
        var _cachedDomList = Planner.mapCard.get(this);
        var _cardDom;

        // Removing all mappings
        _clearDomCache.apply(this, [_cachedDomList]);
        Planner.mapCard.remove(this);
        Planner.Events.publish('cardDeleted', [this]);
    };

    var _removeDom = function(cachedDomList, cardDom) {
      var columnId = cardDom.data('column');

      _undrawDom.apply(this, [cardDom]);

      // Removing all bidirectional mapping
      delete cachedDomList[columnId];
      Planner.mapDom.remove(cardDom);
      Planner.Events.publish('cardDomDeleted', [this, cardDom]);
    };

    var _setDirty = function() {
      // Clearing cache and redraw
      var _cachedDomList = Planner.mapCard.get(this);

      _clearDomCache.apply(this, [_cachedDomList]);
    };

    // Card class definition
    // ---------------------

    Planner.Models.Card = function(attrs) {
        var object = {};

        // Base attributes
        object.id = attrs.id || null;
        object.title = attrs.title || null;
        object.content = attrs.content || null;
        object.start = attrs.start || null;
        object.end = attrs.end || null;
        object.columns = attrs.columns || [];

        // Computed properties
        Object.defineProperty(object, 'header', {get: _generateHeader});

        // Public methods
        object.refresh = _refresh;
        object.refreshDom = _updateDom;
        object.draw = _drawCard;
        object.undraw = _undrawCard;
        object.remove = _removeCard;
        object.setDirty = _setDirty;

        // Object assignment to a global hash map
        Planner.mapCard.put(object, {});

        return object;
    };

})(Planner);
