(function (Plugins, Utils, Set, undefined) {
  'use strict';

  // Plugin constructor and defaults
  // -------------------------------

  var Collision = function (element, options, planner) {
    // TODO: use these as key for a type -> [] structure where type is a rule and [] is an array of object to order
    var SPLITTING = 0
      , OLDEST_ON_LEFT = 1;

    function _manager (card, dom) {
      // Get all column cards except this one
      var collisionGroup = _findCollisions(dom);

      if (collisionGroup.length > 0) {
        _resolveCollisions(dom, collisionGroup);
      }
    }

    function _findCollisions (dom) {
      var stack = []
        , collisions = new Set()
        , currentNode
        , sibling;

      stack.push(dom);

      while(stack.length > 0) {
        currentNode = stack.shift();

        var cardId = parseInt(currentNode.getAttribute('data-id'), 10);
        sibling = dom.parentElement.parentElement.querySelectorAll('.planner-card:not([data-id="' + cardId + '"])');

        for (var i = 0; i < sibling.length; i++) {
          if (_collisionsDetector(currentNode, sibling[i])) {
            if (!collisions.in(sibling[i])) {
              collisions.update([currentNode, sibling[i]]);
              stack.push(sibling[i]);
            }
          }
        }
      }

      return collisions.items();
    }

    function _resolveCollisions (dom, collisionGroup) {
      var startingPosition = Utils.offset(dom.parentNode).left
        , columnWidth = dom.parentNode.offsetWidth;

      // TODO: this collision should create an offset to splittingWidth
//      if (collisionGroup.length > 0) {
//        // ex: var splittingWidth = columnWidth / (splitGroup.length) - offset;
//        // offset => increment x for each collisionGroup
//
//        console.debug('Resolving collision: OLDEST_ON_LEFT');
//      }

      // TODO: this isn't the right behaviour because I'm missing resolution according to conflict rule
      if (collisionGroup.length > 0) {
        console.debug('Resolving collision: SPLITTING');
        console.debug(collisionGroup);

        var splittingWidth = columnWidth / collisionGroup.length;
        for (var i = 0; i < collisionGroup.length; i++) {
          collisionGroup[i].style.width = splittingWidth + 'px';
          collisionGroup[i].style.left = startingPosition + (splittingWidth * i) + 'px';
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

    function _precedenceRules (firstDom, secondDom) {
      var firstMin = parseInt(firstDom.getAttribute('data-start'), 10)
        , secondMin = parseInt(secondDom.getAttribute('data-start'), 10);

      // Check if two elements have the same time (or time + 1)
      if (firstMin === secondMin || firstMin === secondMin + 1 || secondMin === firstMin + 1) {
        return SPLITTING;
      } else {
        return OLDEST_ON_LEFT;
      }
    }

    // TODO: use this event AND a generic "drawingDone" otherwise there are too many (useless) conflict management
    planner.events.subscribe('cardDomDrawn', _manager);
  };

  Collision.DEFAULTS = {};

  // Register this plugin to plugins list
  // ------------------------------------

  Plugins.register('collision', Collision);

})(Planner.Plugins, Planner.Utils, Ds.Set);
