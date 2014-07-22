(function (Plugins, Events, Utils, undefined) {
  'use strict';

  // Plugin constructor
  // ------------------

  var Interaction = function (element, options, planner) {

    // Internals
    // ---------

    this.element = element;
    this.options = options;
    this.planner = planner;

    this.listReduced = [];
    this.currentInteraction = null;
    this.currentCard = null;
    this.currentElement = null;
    this.initialIndex = null;
    this.initialY = null;

    // Private Internals
    // -----------------

    var cachedTimeslots = element.querySelectorAll('.planner-column > div')
      , subscribers = {}
      , listeners = {}
      , that = this;

    var addSubscriber = function(channel, handler) {
      subscribers[channel] = subscribers[channel] || [];
      subscribers[channel].push(handler.bind(that));
    };

    var addListener = function(listener, handler) {
      listeners[listener] = listeners[listener] || [];
      listeners[listener].push(handler.bind(that));
    };

    // Register subscribers
    // --------------------

    addSubscriber('cardDomDrawn', this.addResizeDom);
    addSubscriber('cardDomDrawn', this.cardClick);
    addSubscriber('cardDomDrawn', this.dragCard);

    // Register listeners
    // ------------------

    // TODO: add features detection and choose the right listeners

    addListener('mousedown', this.mouseDown);
    addListener('mousemove', this.mouseMove);
    addListener('mouseup', this.mouseUp);
    addListener('dragover', this.dragOver);
    addListener('drop', this.drop);

    // Extends default behaviour according to other plugins
    // ----------------------------------------------------

    if (Planner.Plugins.isRegistered('mobile')) {
      addSubscriber('cardDomDrawn', this.touchTap);
      addListener('press', this.touchPress);
      addListener('touchmove', this.touchMove);
      addListener('touchend', this.touchEnd);
    }

    // Add subscribers and listeners
    // -----------------------------

    for (var channel in subscribers) {
      if (subscribers.hasOwnProperty(channel)) {
        for (var i = 0; i < subscribers[channel].length; i++) {
          Events.subscribe(channel, subscribers[channel][i]);
        }
      }
    }

    for (var i = 0; i < cachedTimeslots.length; i++) {
      var hammer = new Hammer(cachedTimeslots[i]);

      for (var listener in listeners) {
        if (listeners.hasOwnProperty(listener)) {
          for (var j = 0; j < listeners[listener].length; j++) {
            // TODO: add features detection and use addEventListener or Hammer.on
            cachedTimeslots[i].addEventListener(listener, listeners[listener][j]);
            hammer.on(listener, listeners[listener][j]);
          }
        }
      }
    }

    // Interaction styles
    // ------------------

    var style = Utils.createElement(Planner.Templates.interaction());
    document.querySelector('head').appendChild(style);
  };

  Interaction.DEFAULTS = {
    dragComponent: '---'
  };

  // Register plugin
  // ---------------

  Plugins.Interaction = Interaction;
  Plugins.register('interaction', Interaction);

})(Planner.Plugins, Planner.Events, Planner.Utils);
