;(function(Planner) { 'use strict';

    // Javascript utilities
    // --------------------

    Planner.Utils.pad = function (text, slice) {
        if (typeof slice === 'undefined') {
            slice = -2;
        }
        return ('0' + text).slice(slice);
    }

})(Planner);
