(function (Plugins, Utils, undefined) {
  'use strict';

  // Slider plugin to change visible columns
  // ---------------------------------------

  var Slider = function (element, options) {
    // Store reference for a fast options passing
    this.element = element;
    this.options = options;

    this.currentIndex = 0;

    // Cache selectors
    // Note: it's a huge performance boost
    this.cacheSliders = element.querySelectorAll('.planner-slider');
    this.cacheColumn = element.querySelector('.planner-column');

    // Attach all listeners to planner.js element
    this._attachArrowsEvents();

    if (Planner.Plugins.isRegistered('mobile')) {
      this._attachSlidingTouch();
    }
  };

  Slider.DEFAULTS = {
    minMovement: 15,
    minSwipe: 100,
    headerOffset: 5
  };

  // Private plugin helpers
  // ----------------------

  Slider.prototype._attachArrowsEvents = function () {
    var arrowLeft = this.element.querySelector('.arrow-left');
    // TODO: avoid bind() use
    arrowLeft.addEventListener('click', this._slideLeft.bind(this));

    var arrowRight = this.element.querySelector('.arrow-right');
    // TODO: avoid bind() use
    arrowRight.addEventListener('click', this._slideRight.bind(this));
  };

  Slider.prototype._attachSlidingTouch = function () {
    var startClientX = 0;
    var lastClientX = 0;
    var currentOffset = 0;
    var started = false;

    // TODO: avoid use of that=this pattern
    var self = this;

    var _touchStart = function (event) {
      // If is a touch event, use just the first touch property (i.e. the first finger)
      event = event.touches[0];
      startClientX = event.clientX;
      for (var i = 0; i < self.cacheSliders.length; i++) {
        Utils.removeClass(self.cacheSliders[i], 'animate');
      }
    };

    var _touchMove = function (event) {
      // Calculate delta movement
      var eventTouch = event.touches[0];
      lastClientX = eventTouch.clientX - startClientX;

      // Start sliding without too much swipe
      if (!started && (lastClientX < -self.options.minMovement || lastClientX > self.options.minMovement)) {
        event.preventDefault();
        started = true;
      }

      // Avoid column sliding when user has reached the border
      // Note: 'started' check is required to increase performance on slower mobile devices
      if (started &&
        (self.currentIndex === 0 && lastClientX < 0 ||
          (self.currentIndex !== 0 && self.currentIndex !== self.options.columnLabels.length - 1) ||
          (self.currentIndex === self.options.columnLabels.length - 1 && lastClientX > 0))) {

        self._appendTranslate3d(currentOffset + lastClientX);
      }
    };

    var _touchEnd = function () {
      if (started) {
        started = false;

        for (var i = 0; i < self.cacheSliders.length; i++) {
          Utils.addClass(self.cacheSliders[i], 'animate');
        }

        if (lastClientX > self.options.minSwipe) {
          self._slideLeft();
        } else if (lastClientX < -self.options.minSwipe) {
          self._slideRight();
        } else {
          self._appendTranslate3d(currentOffset);
        }

        lastClientX = 0;
        currentOffset = self._columnOffset();
      }
    };

    // Add listeners
    // -------------

    for (var i = 0; i < this.cacheSliders.length; i++) {
      this.cacheSliders[i].addEventListener('touchstart', _touchStart);
      this.cacheSliders[i].addEventListener('touchmove', _touchMove);
      this.cacheSliders[i].addEventListener('touchend', _touchEnd);
    }
  };

  Slider.prototype._columnOffset = function () {
    var columnWidth = this.cacheColumn.offsetWidth + this.options.headerOffset;

    return -columnWidth * this.currentIndex;
  };

  Slider.prototype._slideLeft = function () {
    if (this.currentIndex > 0) {
      Utils.addClass(this.cacheSliders, 'animate');

      this.currentIndex -= 1;
      this._appendTranslate3d(this._columnOffset());
    }
  };

  Slider.prototype._slideRight = function () {
    // TODO: this behaviour should be optimized with better options passing
    var visibleColumns = document.documentElement.clientWidth <= 768 ?
      this.options.mobileVisibleColumns :
      this.options.visibleColumns;

    if (this.currentIndex < (this.options.columnLabels.length - visibleColumns)) {
      for (var i = 0; i < this.cacheSliders.length; i++) {
        Utils.addClass(this.cacheSliders[i], 'animate');
      }

      this.currentIndex += 1;
      this._appendTranslate3d(this._columnOffset());
    }
  };

  Slider.prototype._appendTranslate3d = function (value) {
    if (typeof value === 'number') {
      var translate = 'translate3d(' + value + 'px, 0, 0)';

      for (var i = 0; i < this.cacheSliders.length; i++) {
        this.cacheSliders[i].style.webkitTransform = translate;
        this.cacheSliders[i].style.mozTransform = translate;
        this.cacheSliders[i].style.msTransform = translate;
        this.cacheSliders[i].style.oTransform = translate;
        this.cacheSliders[i].style.transform = translate;
      }
    } else {
      throw new Error('Unable to append a 3D translation if the value isn\'t a number');
    }
  };

  // Register this plugin to plugins list
  // ------------------------------------

  Plugins.register('slider', Slider);

})(Planner.Plugins, Planner.Utils);
