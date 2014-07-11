(function (Plugins, Utils, undefined) {
  'use strict';

  // Plugin constructor and defaults
  // -------------------------------

  var Crud = function (element, options, planner) {
    this.instance = planner;
    this.element = element;
    this.options = options;

    // Used during card generation
    this.currentInteraction = null;
    this.currentCard = null;
    this.currentElement = null;
    this.listReduced = [];
    this.initialIndex = null;
    this.initialY = null;

    // Adds all required components and attach all interactions
    this.addResize();
    this.attachClick();
    this.attachCreateResize();
    this.attachDragAndDrop();

    // Extends default behaviour according to other plugins
    if (Planner.Plugins.isRegistered('mobile')) {
      this.attachMobileListeners();
    }

    // Add interaction styles
    var style = Utils.createElement(Planner.Templates.interaction());
    document.querySelector('head').appendChild(style);
  };

  Crud.DEFAULTS = {
    dragComponent: '---'
  };

  // Plugin attach events
  // --------------------

  // Publish click event on Card DOM element
  Crud.prototype.attachClick = function () {
    var that = this;

    var cardHandler = function (card, element) {
      element.addEventListener('mouseup', mouseHandler(card, element));
    };

    var mouseHandler = function (card, element) {
      // Avoid this action on event propagation from children or if
      // another interaction is active
      if (that.currentInteraction === null) {
        Planner.Events.publish('cardClicked', [card, element]);
      }
    };

    Planner.Events.subscribe('cardDomDrawn', cardHandler);
  };

  Crud.prototype.attachCreateResize = function () {
    var that = this;

    var mouseDownHandler = function (event) {
      // Avoid this action on event propagation from children
      if (event.currentTarget === event.target) {
        // Start interaction with created objects
        var card = that._createCard(this);

        // TODO: fix me
        // Utils.index(this) doesn't match strictly domId. After full migration to data-attribute,
        // we can use this value to find the correct domId
        var domId = card.columns[0];
        that._startInteraction('dragCreation', card, that.instance.mapCard.get(card)[domId], Utils.index(this), event.clientY);
        event.preventDefault();
      }
    };

    var mouseMoveHandler = function (event) {
      if (that.currentInteraction === 'dragCreation' || that.currentInteraction === 'resize') {
        that._resize(event.clientY);

        event.preventDefault();
      }
    };

    var mouseUpHandler = function (event) {
      if (that.currentInteraction === 'dragCreation') {
        Planner.Events.publish('cardCreated', [that.currentCard, that.currentElement]);

        that._stopInteraction();
        event.preventDefault();
      } else if (that.currentInteraction === 'resize') {
        // TODO: fix this interaction because this way is terribly WRONG!
        Planner.Events.publish('cardUpdated', [that.currentCard, that.currentElement]);
        Utils.removeClass(that.currentElement, 'resizable');

        that._stopInteraction();
        event.preventDefault();
      }
    };

    // Append listeners to all planner timeslots
    var timeslots = that.element.querySelectorAll('.planner-column > div');

    for (var i = 0; i < timeslots.length; i++) {
      timeslots[i].addEventListener('mousedown', mouseDownHandler);
      timeslots[i].addEventListener('mousemove', mouseMoveHandler);
      timeslots[i].addEventListener('mouseup', mouseUpHandler);
    }
  };

  Crud.prototype.attachDragAndDrop = function () {
    var that = this;

    var dragOverHandler = function (event) {
      event.preventDefault();
    };

    var dropHandler = function (event) {
      that._drag(this);

      // TODO: fix me
      // Note: remove all temporary clones because of a webkit bug/feature
      if (!!window.webkitURL) {
        var el = document.querySelector('[data-planner=container] > .planner-card');
        el.parentNode.removeChild(el);
      }

      Planner.Events.publish('cardUpdated', [that.currentCard, that.currentElement]);

      that._stopInteraction();
      event.preventDefault();
    };

    // Append drag events to timeslots
    var timeslots = that.element.querySelectorAll('.planner-column > div');

    for (var i = 0; i < timeslots.length; i++) {
      timeslots[i].addEventListener('dragover', dragOverHandler);
      timeslots[i].addEventListener('drop', dropHandler);
    }

    var cardHandler = function (card, element) {
      element.setAttribute('draggable', true);

      var dragStartHandler = function (event) {
        // Start interaction with created objects
        that._startInteraction('dragMove', card, element);

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
          that.element.appendChild(draggedNode);
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
          that.listReduced.push(element);
        }
      };

      var dropHandler = function () {
        // Avoid to drop a card over another card
        event.preventDefault();
        event.stopPropagation();
        that._resetDrag();
      };

      var dragEndHandler = function () {
        // Remove ghost effect
        Utils.removeClass(element, 'dragging');
        that._resetDrag();
      };

      element.addEventListener('dragstart', dragStartHandler);
      element.addEventListener('dragenter', dragEnterHandler);
      element.addEventListener('drop', dropHandler);
      element.addEventListener('dragend', dragEndHandler);
    };

    Planner.Events.subscribe('cardDomDrawn', cardHandler);
  };

  Crud.prototype.addResize = function () {
    var that = this;

    Planner.Events.subscribe('cardDomDrawn', function (card, element) {
      var resizableDom = Utils.createElement(Planner.Templates.drag({dragComponent: that.options.dragComponent}));

      var mouseDownHandler = function (event) {
        that._startInteraction('resize', card, element, that.instance._attributeToIndex(card.start), Utils.offset(element).top - document.body.scrollTop);
        Utils.addClass(that.currentElement, 'resizable');

        event.preventDefault();
      };

      resizableDom.addEventListener('mousedown', mouseDownHandler);

      // Append element after latest DOM object of a Card
      var cardDoms = element.querySelectorAll('.planner-card-title');
      for (var i = 0; i < cardDoms.length; i++) {
        cardDoms[i].parentNode.appendChild(resizableDom);
      }
    });
  };

  Crud.prototype.attachMobileListeners = function () {
    var that = this;
    var timeslots = that.element.querySelectorAll('.planner-column > div');

    var touchMoveHandler = function (event) {
      if (that.currentCard !== null) {
        that._resize(event.touches[0].clientY);
        event.preventDefault();
      }
    };

    var touchEndHandler = function (event) {
      Planner.Events.publish('cardCreated', [that.currentCard, that.currentElement]);

      that._stopInteraction();
      event.preventDefault();
    };

    for (var i = 0; i < timeslots.length; i++) {
      timeslots[i].addEventListener('touchmove', touchMoveHandler);
      timeslots[i].addEventListener('touchend', touchEndHandler);
    }

    Planner.Events.subscribe('cardDomDrawn', function (card, element) {
      var touchEndHandler = function () {
        Planner.Events.publish('cardClicked', [card, element]);
        // TODO: check if this is required to "Avoid propagation of element on child/parent elements"
        // event.stopPropagation();
      };

      element.addEventListener('touchend', touchEndHandler);
    });
  };

  // Private plugin helpers
  // ----------------------

  Crud.prototype._createCard = function (element) {
    // Create a new card and draw DOM element
    var startAttribute = this.instance._indexToAttribute(Utils.index(element));
    var endAttribute = this.instance._indexToAttribute(Utils.index(element) + 1);
    var column = [Utils.index(element.parentNode) + 1];
    var card = this.options.model({start: startAttribute, end: endAttribute, columns: column});
    this.instance.drawCard(card);

    return card;
  };


  Crud.prototype._startInteraction = function (type, card, element, initialIndex, initialY) {
    // Store variables for further interactions
    this.currentInteraction = type;
    this.currentCard = card;
    this.currentElement = element;
    this.initialIndex = initialIndex;
    this.initialY = initialY;
  };

  Crud.prototype._stopInteraction = function () {
    this.currentInteraction = null;
    this.currentCard = null;
    this.currentElement = null;
    this.initialIndex = null;
    this.initialY = null;
  };

  Crud.prototype._drag = function (destination) {
    var length = this.currentElement.getAttribute('data-end') - this.currentElement.getAttribute('data-start');

    destination.appendChild(this.currentElement);
    var column = Utils.index(this.currentElement.parentNode.parentNode) + 1;
    var startPosition = Utils.index(this.currentElement.parentNode);

    // Update Card  and DOM object
    this.currentCard.update({
      columns: [column],
      start: this.instance._indexToAttribute(startPosition),
      end: this.instance._indexToAttribute(startPosition + length + 1)
    });

    this.instance.updateDom(this.currentElement, this.currentCard, column);
  };

  Crud.prototype._resize = function (pointerY) {
    // Calculate new length
    var currentCardPosition = Math.floor((pointerY - this.initialY) / this.options.timeslotHeight);
    var endIndex = this.initialIndex + currentCardPosition;

    // Update Card  and DOM object
    this.currentCard.update({end: this.instance._indexToAttribute(endIndex + 1)});
    this.instance.updateDom(this.currentElement, this.currentCard);
  };

  Crud.prototype._resetDrag = function () {
    while (this.listReduced.length > 0) {
      Utils.removeClass(this.listReduced.pop(), 'card-small');
    }
  };

  // Register this plugin to plugins list
  // ------------------------------------

  Planner.Plugins.register('interaction', Crud);

})(Planner.Plugins, Planner.Utils);
