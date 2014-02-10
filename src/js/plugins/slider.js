;(function(Planner) { 'use strict';

    // Slider plugin to change visible columns
    // ---------------------------------------

    var Slider = function(planner, options) {
        this.planner = planner;
        this.$element = planner.$element;
        this.options = options;

        // Plugin globals
        this.currentIndex = 0;
    };

    Slider.DEFAULTS = {};

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

    // Private plugin helpers
    // ----------------------

    Slider.prototype._slideLeft = function() {
        if (this.currentIndex > 0) {
            // Column width (includes header padding)
            var columnWidth = this.$element.find('.planner-column').width() + 5;

            this.currentIndex -= 1;
            this._appendTranslate3d(-columnWidth * this.currentIndex);
        }
    };

    Slider.prototype._slideRight = function() {
        // TODO: this behaviour should be optimized with better options passing
        var visibleColumns = document.documentElement.clientWidth <= 768 ? this.$element.data('pl.plugins.mobile').options.mobileVisibleColumns : this.options.visibileColumns;

        if (this.currentIndex < (this.options.columnLabels.length - visibleColumns)) {
            // Column width (includes header padding)
            var columnWidth = this.$element.find('.planner-column').width() + 5;

            this.currentIndex += 1;
            this._appendTranslate3d(-columnWidth * this.currentIndex);
        }
    };

    Slider.prototype._appendTranslate3d = function(value) {
        if (typeof value === 'number') {
            var slider = this.$element.find('.planner-slider');

            slider.css('-webkit-transform', 'translate3d(' + value + 'px, 0, 0)');
            slider.css('-moz-transform', 'translate3d(' + value + 'px, 0, 0)');
            slider.css('-ms-transform', 'translate3d(' + value + 'px, 0, 0)');
            slider.css('-o-transform', 'translate3d(' + value + 'px, 0, 0)');
            slider.css('transform', 'translate3d(' + value + 'px, 0, 0)');
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
