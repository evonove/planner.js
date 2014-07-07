;(function(Utils, undefined) { 'use strict';

    // Javascript utilities
    // --------------------

    Utils.pad = function(text, slice) {
        if (typeof slice === 'undefined') {
            slice = -2;
        }
        return ('0' + text).slice(slice);
    };

    Utils.extend = function(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i]) {
                continue;
            }

            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    out[key] = arguments[i][key];
                }
            }
        }

        return out;
    };

  Utils.createElement = function(html) {
    var el = document.createElement('div');
    el.innerHTML = html;

    return el.childNodes[0];
  };

})(Planner.Utils = Planner.Utils || {});
