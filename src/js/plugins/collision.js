(function (Plugins, Utils, Set, HashMap, undefined) {
  'use strict';

  // Plugin constructor and defaults
  // -------------------------------

  var Collision = function (element, options, planner) {
    var SPLITTING = 0;
    var OLDEST_ON_LEFT = 1;

    // Caching
    var _cacheColumn = element.querySelector('.planner-column');

    // TODO: use this event AND a generic "drawingDone" otherwise there are too many (useless) conflict management
    planner.events.subscribe('/card/interaction/drawn', _collision);
    planner.events.subscribe('/card/actions/dragged', _collisionDrag);
    planner.events.subscribe('cardDomDrawn', _collision);

    function _collision (card, dom) {
      var collisionGroup = _findCollisions(dom);

      _resolveCollisions(dom, collisionGroup);
    }

    function _collisionDrag (card, dom) {
      var collisionGroup = _findCollisions(dom);
      var nextDom = collisionGroup.all.items()[1];

      collisionGroup.left.discard(dom);
      collisionGroup.split.discard(dom);
      _removeCollisionEffects(collisionGroup.all.items());
      _resolveCollisions(nextDom, collisionGroup);
    }

    function _findCollisions (dom) {
      var stack = []
        , items = new Set()
        , split = new Set()
        , left = new Set()
        , currentNode
        , timeslot
        , sibling
        , cardId;

      stack.push(dom);

      while(stack.length > 0) {
        currentNode = stack.shift();
        timeslot = dom.parentElement;

        if (timeslot !== null) {
          cardId = parseInt(currentNode.getAttribute('data-id'), 10);
          sibling = dom.parentElement.parentElement.querySelectorAll('.planner-card:not(.dragged):not([data-id="' + cardId + '"])');

          for (var i = 0, n = sibling.length; i < n; i++) {
            if (_collisionsDetector(currentNode, sibling[i])) {
              var rule = _collisionRule(currentNode, sibling[i]);

              if (rule === SPLITTING) {
                if (!split.in(sibling[i])) {
                  split.update([currentNode, sibling[i]]);
                  items.update([currentNode, sibling[i]]);
                  stack.push(sibling[i]);
                }

              } else {
                if (!left.in(sibling[i])) {
                  left.update([currentNode, sibling[i]]);
                  items.update([currentNode, sibling[i]]);
                  stack.push(sibling[i]);
                }
              }
            }
          }
        }
      }

      // Put there all collision types
      return {
        all: items,
        split: split,
        left: left
      };
    }

    function _resolveCollisions (dom, collisionGroup) {
      if (collisionGroup.split.size > 0) {
        _split(dom, collisionGroup.split.items());
      }

      if (collisionGroup.left.size > 0) {
        _moveOnLeft(dom, collisionGroup.left.items());
      }
    }

    // Conflicts resolvers
    // -------------------

    function _split (dom, collisionGroup) {
      var startingPosition = dom.offsetLeft;
      var splittingWidth = _cacheColumn.offsetWidth / collisionGroup.length;

      for (var i = 0, n = collisionGroup.length; i < n; i++) {
        var offsetLeft = startingPosition + (splittingWidth * i);

        collisionGroup[i].style.width = splittingWidth + 'px';
        collisionGroup[i].style.left = offsetLeft + 'px';
      }
    }

    function _moveOnLeft (dom, collisionGroup) {
      var startingPosition = dom.offsetLeft;
      var currentLeft;
      var currentWidth;
      var offsetLeft;
      var offsetWidth;
      var splittingOffset;

      collisionGroup.sort(_orderOldestLeft);
      collisionGroup.shift();

      for (var i = 0, n = collisionGroup.length; i < n; i++) {
        // Preserve current styles if set (ex: this card is in conflict with one card for SPLITTING
        // and with another one with OLDEST_ON_LEFT

        if (!!collisionGroup[i].style.left) {
          var elementLeft = collisionGroup[i].style.left
            , elementWidth = collisionGroup[i].style.width;

          // Removing 'px' suffix for left and width style
          elementLeft = elementLeft.substring(0, elementLeft.length - 2);
          elementWidth = elementWidth.substring(0, elementWidth.length - 2);

          currentLeft = parseInt(elementLeft, 10);
          currentWidth = parseInt(elementWidth, 10);
        } else {
          currentLeft = startingPosition - options.marginAdjustment;
          currentWidth = collisionGroup[i].offsetWidth;
        }

        // Add a splitting offset if this card is split
        splittingOffset = _cacheColumn.offsetWidth / currentWidth * options.collisionOffset;

        // TODO: Bug here! splittingOffset is wrong
        offsetLeft = currentLeft + options.collisionOffset;
        offsetWidth = collisionGroup[i].offsetWidth - splittingOffset;
        collisionGroup[i].style.left = offsetLeft + 'px';
        collisionGroup[i].style.width = offsetWidth + 'px';
      }
    }

    // Collisions and rules
    // --------------------

    function _collisionsDetector (firstDom, secondDom) {
      var min = parseInt(firstDom.getAttribute('data-start'), 10)
        , max = parseInt(firstDom.getAttribute('data-end'), 10)
        , currentMin = parseInt(secondDom.getAttribute('data-start'), 10)
        , currentMax = parseInt(secondDom.getAttribute('data-end'), 10);

      if (min >= currentMin && min <= currentMax || max >= currentMin && max <= currentMax) {
        return true;
      } else {
        return currentMin >= min && currentMax <= max || currentMin >= min && currentMax <= max;
      }
    }

    function _collisionRule (firstDom, secondDom) {
      var firstMin = parseInt(firstDom.getAttribute('data-start'), 10)
        , secondMin = parseInt(secondDom.getAttribute('data-start'), 10);

      // Put there all collision rules
      // -----------------------------

      // Check if two elements have the same time (or time + 1)
      if (firstMin === secondMin || firstMin === secondMin + 1 || secondMin === firstMin + 1) {
        return SPLITTING;
      } else {
        return OLDEST_ON_LEFT;
      }
    }

    // Helpers
    // -------

    function _removeCollisionEffects (doms) {
      for (var i = 0, n = doms.length; i < n; i++) {
        doms[i].style.left = '';
        doms[i].style.width = '';
      }
    }

    function _orderOldestLeft (firstDom, secondDom) {
      var firstDomMin = parseInt(firstDom.getAttribute('data-start'), 10)
        , secondDomMin = parseInt(secondDom.getAttribute('data-start'), 10);

      return firstDomMin - secondDomMin;
    }
  };

  Collision.DEFAULTS = {
    marginAdjustment: 3,
    collisionOffset: 5
  };

  // Register this plugin to plugins list
  // ------------------------------------

  Plugins.register('collision', Collision);

})(Planner.Plugins, Planner.Utils, Ds.Set, Ds.HashMap);
