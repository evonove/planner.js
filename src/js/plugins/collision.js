(function (Plugins, Utils, undefined) {
  'use strict';

  // Plugin constructor and defaults
  // -------------------------------

  var Collision = function (element, options, planner) {
    function _detectCollisions (card, dom) {
      // Checking range
      var min = dom.getAttribute('data-start')
        , max = dom.getAttribute('data-end')
        , collisionGroup = []
        , currentMin
        , currentMax;

      // Get all column cards except this one
      var cards = dom.parentElement.parentElement.querySelectorAll('.planner-card:not([data-id="' + card.id + '"])');
      for (var i = 0; i < cards.length; i++) {
        currentMin = cards[i].getAttribute('data-start');
        currentMax = cards[i].getAttribute('data-end');

        // Collision ?
        var collision = min >= currentMin && min <= currentMax || max >= currentMin && max <= currentMax;
        collision = collision ? true : currentMin >= min && currentMax <= max || currentMin >= min && currentMax <= max;
        collision && collisionGroup.push(cards[i]);
      }

      collisionGroup.length > 0 && _resolveCollisions(dom, collisionGroup);
    }

    function _resolveCollisions(dom, collisionGroup) {
      console.debug('Collision group:');
      console.debug(collisionGroup);
    }

    planner.events.subscribe('cardDomDrawn', _detectCollisions);
  };

  Collision.DEFAULTS = {};

  // Register this plugin to plugins list
  // ------------------------------------

  Plugins.register('collision', Collision);

})(Planner.Plugins, Planner.Utils);
