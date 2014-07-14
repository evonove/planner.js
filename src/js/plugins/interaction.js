(function (Plugins, Utils, undefined) {
  'use strict';

  // Plugin constructor
  // ------------------

  var Interaction = function (element, options, planner) {
      var timeslots = element.querySelectorAll('.planner-column > div')

      // Used during interactions
      , currentInteraction = null
      , currentCard = null
      , currentElement = null
      , listReduced = []
      , initialIndex = null
      , initialY = null;

    // Mouse handlers
    // --------------

    var _cardHandler = function (card, element) {
      element.addEventListener('click', _mouseHandler(card, element));
    };

    var _mouseHandler = function (card, element) {
      // Avoid this action on event propagation from children or if
      // another interaction is active
      if (currentInteraction === null) {
        Planner.Events.publish('cardClicked', [card, element]);
      }
    };

    var _mouseDownHandler = function (event) {
      // Avoid this action on event propagation from children
      if (event.currentTarget === event.target) {
        // Start interaction with created objects
        var card = _createCard(this);

        // TODO: fix me
        // Utils.index(this) doesn't match strictly domId. After full migration to data-attribute,
        // we can use this value to find the correct domId
        var domId = card.columns[0];
        _startInteraction('dragCreation', card, planner.mapCard.get(card)[domId], Utils.index(this), event.clientY);
        event.preventDefault();
      }
    };

    var _mouseMoveHandler = function (event) {
      if (currentInteraction === 'dragCreation' || currentInteraction === 'resize') {
        _resize(event.clientY);

        event.preventDefault();
      }
    };

    var _mouseUpHandler = function (event) {
      if (currentInteraction === 'dragCreation') {
        Planner.Events.publish('cardCreated', [currentCard, currentElement]);

        _stopInteraction();
        event.preventDefault();
      } else if (currentInteraction === 'resize') {
        // TODO: fix this interaction because this way is terribly WRONG!
        Planner.Events.publish('cardUpdated', [currentCard, currentElement]);
        Utils.removeClass(currentElement, 'resizable');

        _stopInteraction();
        event.preventDefault();
      }
    };

    // Drag and drop handlers
    // ----------------------

    var _dragOverHandler = function (event) {
      event.preventDefault();
    };

    var _dropHandler = function (event) {
      _drag(this);

      // TODO: fix me
      // Note: remove all temporary clones because of a webkit bug/feature
      if (!!window.webkitURL) {
        var el = document.querySelector('[data-planner=container] > .planner-card');
        el.parentNode.removeChild(el);
      }

      Planner.Events.publish('cardUpdated', [currentCard, currentElement]);

      _stopInteraction();
      event.preventDefault();
    };

    var _dragCardHandler = function (card, element) {
      element.setAttribute('draggable', true);

      var dragStartHandler = function (event) {
        // Start interaction with created objects
        _startInteraction('dragMove', card, element);

        // Required for Firefox
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', '[Object] Card');

        // TODO: fix me
        // Note: in webkit browsers, drag-n-drop doesn't create a ghost image if the original
        // object is placed inside a container with -webkit-transform attribute. The only available
        // solution (at the moment) is to clone the object and put it inside an upper container.
        var draggedNode = this;
        if (!!window.webkitURL) {
          draggedNode = this.cloneNode(true);
          draggedNode.style.width = element.offsetWidth + 'px';
          Utils.addClass(draggedNode, 'dragging');
          element.appendChild(draggedNode);
        }

        event.dataTransfer.setDragImage(draggedNode, 20, 20);

        // Add a ghost effect
        Utils.addClass(element, 'dragging');
      };

      var dragEnterHandler = function () {
        // Reduce card size if draggedElement goes upfront another card
        // and store the node to remove this effect later
        if (!Utils.hasClass(element, 'card-small')) {
          Utils.addClass(element, 'card-small');
          listReduced.push(element);
        }
      };

      var dropHandler = function () {
        // Avoid to drop a card over another card
        event.preventDefault();
        event.stopPropagation();
        _resetReducedDom();
      };

      var dragEndHandler = function () {
        // Remove ghost effect
        Utils.removeClass(element, 'dragging');
        _resetReducedDom();
      };

      element.addEventListener('dragstart', dragStartHandler);
      element.addEventListener('dragenter', dragEnterHandler);
      element.addEventListener('drop', dropHandler);
      element.addEventListener('dragend', dragEndHandler);
    };

    // Touch handlers
    // --------------

    var _touchMoveHandler = function (event) {
      if (currentCard !== null) {
        _resize(event.touches[0].clientY);
        event.preventDefault();
      }
    };

    var _touchEndHandler = function (event) {
      Planner.Events.publish('cardCreated', [currentCard, currentElement]);

      _stopInteraction();
      event.preventDefault();
    };

    var _touchHandler = function (card, element) {
      var touchEndHandler = function () {
        Planner.Events.publish('cardClicked', [card, element]);
        // TODO: check if this is required to "Avoid propagation of element on child/parent elements"
        // event.stopPropagation();
      };

      element.addEventListener('touchend', touchEndHandler);
    };

    // Private methods
    // ---------------

    var _addResizeDom = function (card, element) {
      var resizableDom = Utils.createElement(Planner.Templates.drag({dragComponent: options.dragComponent}));

      var mouseDownHandler = function (event) {
        _startInteraction('resize', card, element, planner._attributeToIndex(card.start), Utils.offset(element).top - document.body.scrollTop);
        Utils.addClass(currentElement, 'resizable');

        event.preventDefault();
      };

      resizableDom.addEventListener('mousedown', mouseDownHandler);

      // Append element after latest DOM object of a Card
      var cardDoms = element.querySelectorAll('.planner-card-title');
      for (var i = 0; i < cardDoms.length; i++) {
        cardDoms[i].parentNode.appendChild(resizableDom);
      }
    };

    // Private plugin helpers
    // ----------------------

    var _createCard = function (element) {
      // Create a new card and draw DOM element
      var startAttribute = planner._indexToAttribute(Utils.index(element));
      var endAttribute = planner._indexToAttribute(Utils.index(element) + 1);
      var column = [Utils.index(element.parentNode) + 1];
      var card = options.model({start: startAttribute, end: endAttribute, columns: column});

      // TODO: card draw inside card creation?
      planner.drawCard(card);
      return card;
    };


    var _startInteraction = function (type, card, element, index, y) {
      // Store variables for further interactions
      currentInteraction = type;
      currentCard = card;
      currentElement = element;
      initialIndex = index;
      initialY = y;
    };

    var _stopInteraction = function () {
      currentInteraction = null;
      currentCard = null;
      currentElement = null;
      initialIndex = null;
      initialY = null;
    };

    var _drag = function (destination) {
      var length = currentElement.getAttribute('data-end') - currentElement.getAttribute('data-start');

      destination.appendChild(currentElement);
      var column = Utils.index(currentElement.parentNode.parentNode) + 1;
      var startPosition = Utils.index(currentElement.parentNode);

      // Update Card  and DOM object
      currentCard.update({
        columns: [column],
        start: planner._indexToAttribute(startPosition),
        end: planner._indexToAttribute(startPosition + length + 1)
      });

      planner.updateDom(currentElement, currentCard, column);
    };

    var _resetReducedDom = function () {
      while (listReduced.length > 0) {
        Utils.removeClass(listReduced.pop(), 'card-small');
      }
    };

    var _resize = function (pointerY) {
      // Calculate new length
      var currentCardPosition = Math.floor((pointerY - initialY) / options.timeslotHeight);
      var endIndex = initialIndex + currentCardPosition;

      // Update Card  and DOM object
      currentCard.update({end: planner._indexToAttribute(endIndex + 1)});
      planner.updateDom(currentElement, currentCard);
    };

    // Register components
    // -------------------

    // Subscribes handlers to all required channels
    Planner.Events.subscribe('cardDomDrawn', _addResizeDom);
    Planner.Events.subscribe('cardDomDrawn', _cardHandler);
    Planner.Events.subscribe('cardDomDrawn', _dragCardHandler);

    // Add listeners to all planner components
    // TODO: create a generic 'main' loop where all interaction parts will register
    for (var i = 0; i < timeslots.length; i++) {
      timeslots[i].addEventListener('mousedown', _mouseDownHandler);
      timeslots[i].addEventListener('mousemove', _mouseMoveHandler);
      timeslots[i].addEventListener('mouseup', _mouseUpHandler);
      timeslots[i].addEventListener('dragover', _dragOverHandler);
      timeslots[i].addEventListener('drop', _dropHandler);
    }

    // Extends default behaviour according to other plugins
    if (Planner.Plugins.isRegistered('mobile')) {
      Planner.Events.subscribe('cardDomDrawn', _touchHandler);

      // TODO: user handlers register to add all _touch* handler
      for (var j = 0; j < timeslots.length; j++) {
        timeslots[j].addEventListener('touchmove', _touchMoveHandler);
        timeslots[j].addEventListener('touchend', _touchEndHandler);
      }
    }

    // Add interaction styles
    // TODO: create a generic 'main' loop where all interaction styles will be loaded
    var style = Utils.createElement(Planner.Templates.interaction());
    document.querySelector('head').appendChild(style);
  };

  Interaction.DEFAULTS = {
    dragComponent: '---'
  };

  // Register this plugin to plugins list
  // ------------------------------------

  Planner.Plugins.register('interaction', Interaction);

})(Planner.Plugins, Planner.Utils);
