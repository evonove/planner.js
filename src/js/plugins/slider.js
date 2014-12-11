(function (window, Plugins, Modernizr, undefined) {
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

    var landscape = false;

    // Private plugin helpers
    // ----------------------

    var that = this;

    var _attachArrowsEvents = function () {
      var arrowLeft = that.element.querySelector('.arrow-left')
        , arrowRight = that.element.querySelector('.arrow-right');

      arrowLeft.addEventListener('click', that.slideLeft.bind(that));
      arrowRight.addEventListener('click', that.slideRight.bind(that));
    };

    var _attachSlidingTouch = function () {
      var startClientX = 0;
      var lastClientX = 0;
      var currentOffset = 0;
      var started = false;

      var _touchStart = function (event) {
        // If is a touch event, use just the first touch property (i.e. the first finger)
        event = event.touches[0];
        startClientX = event.clientX;
      };

      var _touchMove = function (event) {
        // Calculate delta movement
        var eventTouch = event.touches[0];
        lastClientX = eventTouch.clientX - startClientX;

        // Start sliding without too much swipe
        if (!started && (lastClientX < -that.options.minMovement || lastClientX > that.options.minMovement)) {
          started = true;

          for (var i = 0; i < that.cacheSliders.length; i++) {
            that.cacheSliders[i].style.transition = 'none';
          }
        }

        // Avoid column sliding when user has reached the border
        // Note: 'started' check is required to increase performance on slower mobile devices
        if (started &&
          (that.currentIndex === 0 && lastClientX < 0 ||
          (that.currentIndex !== 0 && that.currentIndex !== that.options.columnLabels.length - 1) ||
          (that.currentIndex === that.options.columnLabels.length - 1 && lastClientX > 0))) {

          _appendTranslate3d(currentOffset + lastClientX);
        }
      };

      var _touchEnd = function () {
        if (started) {
          started = false;

          if (lastClientX > that.options.minSwipe) {
            that.slideLeft();
          } else if (lastClientX < -that.options.minSwipe) {
            that.slideRight();
          } else {
            _appendTranslate3d(currentOffset);
          }

          for (var i = 0; i < that.cacheSliders.length; i++) {
            that.cacheSliders[i].style.transition = '';
          }

          lastClientX = 0;
          currentOffset = _columnOffset();
        }
      };

      // Add listeners
      // -------------

      for (var i = 0; i < that.cacheSliders.length; i++) {
        that.cacheSliders[i].addEventListener('touchstart', _touchStart);
        that.cacheSliders[i].addEventListener('touchmove', _touchMove);
        that.cacheSliders[i].addEventListener('touchend', _touchEnd);
      }
    };

    var _columnOffset = function () {
      var columnWidth = that.cacheColumn.offsetWidth + that.options.headerOffset;

      return -columnWidth * that.currentIndex;
    };

    var _appendTranslate3d = function (value) {
      if (typeof value === 'number') {
        var translate = 'translate3d(' + value + 'px, 0, 0)';

        for (var i = 0; i < that.cacheSliders.length; i++) {
          that.cacheSliders[i].style.webkitTransform = translate;
          that.cacheSliders[i].style.mozTransform = translate;
          that.cacheSliders[i].style.msTransform = translate;
          that.cacheSliders[i].style.oTransform = translate;
          that.cacheSliders[i].style.transform = translate;
        }
      } else {
        throw new Error('Unable to append a 3D translation if the value isn\'t a number');
      }
    };

    // Privileged methods
    // ------------------

    this.slideLeft = function () {
      if (this.currentIndex > 0) {
        this.currentIndex -= 1;
        _appendTranslate3d(_columnOffset());
      }
    };

    this.slideRight = function () {
      var visibleColumns
        , clientWidth = document.documentElement.clientWidth;

      // desktop
      if (clientWidth >= 992) {
        visibleColumns = this.options.visibleColumns;
      }
      // mobile
      else {
        var mobileType = clientWidth < 768 ? 'phone' : 'tablet'
          , orientation = landscape ? 'landscape' : 'portrait';

        visibleColumns = this.options.mobileVisibleColumns[mobileType][orientation];
      }

      if (this.currentIndex < (this.options.columnLabels.length - visibleColumns)) {
        this.currentIndex += 1;
        _appendTranslate3d(_columnOffset());
      }
    };

    // Initialization logic
    // --------------------

    updateOrientation();

    // Attach all listeners
    // --------------------

    if (Modernizr.touch && Planner.Plugins.isRegistered('mobile')) {
      window.addEventListener('resize', updateOrientation, false);
      _attachSlidingTouch();
    } else {
      _attachArrowsEvents();
    }

    /**
     * @name orientationChanged
     * @desc Changes the landscape status
     */
    function updateOrientation () {
      landscape = window.innerHeight < window.innerWidth;
    }
  };

  Slider.DEFAULTS = {
    minMovement: 50,
    minSwipe: 90,
    headerOffset: 5
  };

  // Register plugin
  // ---------------

  Plugins.Slider = Slider;
  Plugins.register('slider', Slider);

})(window, Planner.Plugins, Planner.Modernizr);
