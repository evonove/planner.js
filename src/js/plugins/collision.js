(function (Plugins, Utils, undefined) {
  'use strict';

  // Plugin constructor and defaults
  // -------------------------------

  var Collision = function (element, options, planner) {
    var SPLITTING = 0
      , OLDEST_ON_LEFT = 1;

    function _detectCollisions (card, dom) {
      // Checking range
      var min = parseInt(dom.getAttribute('data-start'), 10)
        , max = parseInt(dom.getAttribute('data-end'), 10)
        , collisionGroup = []
        , splitGroup = []
        , currentMin
        , currentMax;

      // Get all column cards except this one
      var doms = dom.parentElement.parentElement.querySelectorAll('.planner-card:not([data-id="' + card.id + '"])');
      for (var i = 0; i < doms.length; i++) {
        currentMin = parseInt(doms[i].getAttribute('data-start'), 10);
        currentMax = parseInt(doms[i].getAttribute('data-end'), 10);

        // Collision ?
        var collision = min >= currentMin && min <= currentMax || max >= currentMin && max <= currentMax;
        collision = collision ? true : currentMin >= min && currentMax <= max || currentMin >= min && currentMax <= max;
        var rule = collision && _precedenceRules(min, currentMin);

        switch (rule) {
          case SPLITTING:
            splitGroup.push(doms[i]);
            break;
          case OLDEST_ON_LEFT:
            collisionGroup.push(doms[i]);
            break;
        }
      }

      // TODO: in theory, this conflict is a collision OR a split
      (collisionGroup.length > 0  || splitGroup.length > 0) && _resolveCollisions(dom, collisionGroup, splitGroup);
    }

    function _resolveCollisions (dom, collisionGroup, splitGroup) {

      var startingPosition = Planner.Utils.offset(dom.parentNode).left;
      var columnWidth = dom.parentNode.offsetWidth;

      if (collisionGroup.length > 0) {
        // TODO: this collision should create an offset to splittingWidth
        // ex: var splittingWidth = columnWidth / (splitGroup.length + 1) - offset;
        // offset => increment x for each collisionGroup

        console.debug('Resolving collision: OLDEST_ON_LEFT');
      }

      if (splitGroup.length > 0) {
        console.debug('Resolving collision: SPLITTING');
        console.debug(splitGroup);

        var splittingWidth = columnWidth / (splitGroup.length + 1);

        dom.style.width = splittingWidth + 'px';
        dom.style.left = startingPosition + 'px';

        for (var i = 0; i < splitGroup.length; i++) {
          splitGroup[i].style.width = splittingWidth + 'px';
          splitGroup[i].style.left = startingPosition + (splittingWidth * (i + 1)) + 'px';
        }
      }
    }

    function _precedenceRules (firstMin, secondMin) {
      // Check if two elements have the same time (or time + 1)
      if (firstMin === secondMin || firstMin === secondMin + 1 || secondMin === firstMin + 1) {
        return SPLITTING;
      } else {
        return OLDEST_ON_LEFT;
      }
    }

    planner.events.subscribe('cardDomDrawn', _detectCollisions);
  };

  Collision.DEFAULTS = {};

  // Register this plugin to plugins list
  // ------------------------------------

  Plugins.register('collision', Collision);

})(Planner.Plugins, Planner.Utils);
