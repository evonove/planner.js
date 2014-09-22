(function (Plugins, Utils, Set, undefined) {
  'use strict';

  // Plugin constructor and defaults
  // -------------------------------

  var Collision = function (element, options, planner) {
    var SPLITTING = 0
      , OLDEST_ON_LEFT = 1;

    function _manager (card, dom, exclude) {
      var collisionGroup = _findCollisions(dom);

      if (!!exclude) {
        collisionGroup.left.discard(dom);
        collisionGroup.split.discard(dom);
        _removeCollisionEffects(collisionGroup.all.items());
      }

      _resolveCollisions(dom, collisionGroup);
    }

    function _findCollisions (dom) {
      var stack = []
        , items = new Set()
        , split = new Set()
        , left = new Set()
        , currentNode
        , sibling
        , cardId;

      stack.push(dom);

      while(stack.length > 0) {
        currentNode = stack.shift();

        cardId = parseInt(currentNode.getAttribute('data-id'), 10);
        sibling = dom.parentElement.parentElement.querySelectorAll('.planner-card:not(.dragged):not([data-id="' + cardId + '"])');

        for (var i = 0; i < sibling.length; i++) {
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

      // Put there all collision types
      return {
        all: items,
        split: split,
        left: left
      };
    }

    function _resolveCollisions (dom, collisionGroup) {
      var split = collisionGroup.split.items()
        , left = collisionGroup.left.items()
        , startingPosition = dom.offsetLeft
        , columnWidth = dom.parentNode.offsetWidth
        , currentLeft
        , currentWidth
        , splittingOffset
        , i;

      // Put there all collision resolvers
      // ---------------------------------

      if (split.length > 0) {
        var splittingWidth = columnWidth / split.length;

        for (i = 0; i < split.length; i++) {
          split[i].style.width = splittingWidth + 'px';
          split[i].style.left = startingPosition + (splittingWidth * i) + 'px';
        }
      }

      if (left.length > 0) {
        left.sort(_orderOldestLeft);
        left.shift();

        for (i = 0; i < left.length; i++) {
          // Preserve current styles if set (ex: this card is in conflict with one card for SPLITTING
          // and with another one with OLDEST_ON_LEFT

          if (!!left[i].style.left) {
            // Removing 'px' suffix for left and width style
            var elementLeft = left[i].style.left
              , elementWidth = left[i].style.width;

            elementLeft = elementLeft.substring(0, elementLeft.length - 2);
            elementWidth = elementWidth.substring(0, elementWidth.length - 2);

            currentLeft = parseInt(elementLeft, 10);
            currentWidth = parseInt(elementWidth, 10);
          } else {
            currentLeft = startingPosition - options.marginAdjustment;
            currentWidth = left[i].offsetWidth;
          }

          // Add a splitting offset if this card is splitted
          splittingOffset = columnWidth / currentWidth * options.collisionOffset;

          // TODO: Bug here! splittingOffset is wrong
          left[i].style.left = currentLeft + options.collisionOffset + 'px';
          left[i].style.width = left[i].offsetWidth - splittingOffset + 'px';
        }
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
      for (var i = 0; i < doms.length; i++) {
        doms[i].style.left = '';
        doms[i].style.width = '';
      }
    }

    function _orderOldestLeft (firstDom, secondDom) {
      var firstDomMin = parseInt(firstDom.getAttribute('data-start'), 10)
        , secondDomMin = parseInt(secondDom.getAttribute('data-start'), 10);

      return firstDomMin - secondDomMin;
    }

    // TODO: use this event AND a generic "drawingDone" otherwise there are too many (useless) conflict management
    planner.events.subscribe('/card/interaction/drawn', _manager);
    planner.events.subscribe('cardDomDrawn', _manager);
    planner.events.subscribe('/card/actions/dragged', _manager);
  };

  Collision.DEFAULTS = {
    marginAdjustment: 3,
    collisionOffset: 5
  };

  // Register this plugin to plugins list
  // ------------------------------------

  Plugins.register('collision', Collision);

})(Planner.Plugins, Planner.Utils, Ds.Set);
