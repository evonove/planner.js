;(function(Planner) { 'use strict';

    // Slider plugin to change visible columns
    // ---------------------------------------

    var Slider = function(planner, options) {
        this.planner = planner;
        this.$element = planner.$element;
        this.options = options;

        // Plugin globals
        this.currentIndex = 0;

        // Cache selectors
        // Note: it's a huge performance boost
        this.cacheSlider = this.$element.find('.planner-slider');
        this.cacheColumn = this.$element.find('.planner-column');
    };

    Slider.DEFAULTS = {
        minMovement: 8,
        minSwipe: 100,
        headerOffset: 5
    };

    // Create dynamic styles
    // ---------------------

    Slider.prototype.attachArrowsEvents = function() {
        var $element = Planner.$element;
        var self = this;

        $element.find('.arrow-left').on('click', function() {
            self._slideLeft();
        });

        $element.find('.arrow-right').on('click', function() {
            self._slideRight();
        });
    };

    Slider.prototype.attachSlidingTouch = function() {
        var startClientX = 0;
        var lastClientX = 0;
        var currentOffset = 0;
        var started = false;
        var self = this;

        self.cacheSlider.on({
            'touchstart': function(event) {
                // If is a touch event, use just the first touch property (i.e. the first finger)
                event = event.originalEvent.touches[0];
                startClientX = event.clientX;
            },
            'touchmove': function(event) {
                // Calculate delta movement
                var eventTouch = event.originalEvent.touches[0];
                lastClientX = eventTouch.clientX - startClientX;

                // Start touch sliding with not too much swipe
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
            },
            'touchend': function() {
                if (started) {
                    started = false;

                    if (lastClientX > self.options.minSwipe) {
                        self._slideLeft();
                    } else if (lastClientX < -self.options.minSwipe) {
                        self._slideRight();
                    } else {
                        self.cacheSlider.addClass('animate');
                        self._appendTranslate3d(currentOffset);
                    }

                    lastClientX = 0;
                    currentOffset = self._columnOffset();
                }
            },
            'transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd': function() {
                self.cacheSlider.removeClass('animate');
            }
        });
    };

    // Private plugin helpers
    // ----------------------

    Slider.prototype._columnOffset = function() {
        var columnWidth = this.cacheColumn.width() + this.options.headerOffset;

        return -columnWidth * this.currentIndex;
    };

    Slider.prototype._slideLeft = function() {
        if (this.currentIndex > 0) {
            this.cacheSlider.addClass('animate');

            this.currentIndex -= 1;
            this._appendTranslate3d(this._columnOffset());
        }
    };

    Slider.prototype._slideRight = function() {
        // TODO: this behaviour should be optimized with better options passing
        var visibleColumns = document.documentElement.clientWidth <= 768 ? this.$element.data('pl.plugins.mobile').options.mobileVisibleColumns : this.options.visibleColumns;

        if (this.currentIndex < (this.options.columnLabels.length - visibleColumns)) {
            this.cacheSlider.addClass('animate');

            this.currentIndex += 1;
            this._appendTranslate3d(this._columnOffset());
        }
    };

    Slider.prototype._appendTranslate3d = function(value) {
        if (typeof value === 'number') {
            this.cacheSlider.css('-webkit-transform', 'translate3d(' + value + 'px, 0, 0)');
            this.cacheSlider.css('-moz-transform', 'translate3d(' + value + 'px, 0, 0)');
            this.cacheSlider.css('-ms-transform', 'translate3d(' + value + 'px, 0, 0)');
            this.cacheSlider.css('-o-transform', 'translate3d(' + value + 'px, 0, 0)');
            this.cacheSlider.css('transform', 'translate3d(' + value + 'px, 0, 0)');
        } else {
            throw new Error('Unable to append a 3D translation if the value isn\'t a number');
        }
    };

    // Slider plugin definition
    // ------------------------

    var old = $.fn.slider;

    $.fn.slider = function(option) {
        var planner = this;

        return this.$element.each(function() {
            var $this = $(this);
            var data = $this.data('pl.plugins.slider');
            var options = $.extend({}, Slider.DEFAULTS, $this.data('pl.planner').options, typeof option === 'object' && option);

            // If this node isn't initialized, call the constructor
            if (!data) {
                $this.data('pl.plugins.slider', (data = new Slider(planner, options)));
            }

            data.attachArrowsEvents();

            if (Planner.Plugins.isRegistered('mobile')) {
                data.attachSlidingTouch();
            }
        });
    };

    $.fn.slider.constructor = Slider;

    // Slider no conflict
    // ------------------

    $.fn.slider.noConflict = function() {
        $.fn.slider = old;
        return this;
    };

    // Register this plugin to plugins list
    // ------------------------------------

    Planner.Plugins.register('slider', $.fn.slider);

})(Planner);
