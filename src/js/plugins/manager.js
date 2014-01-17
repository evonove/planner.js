;(function(Planner) { 'use strict';

    Planner.Plugins = Planner.Plugins || {};
    Planner.Plugins.fn = [];

    // Register plugins callback
    // -------------------------

    Planner.Plugins.register = function(pluginName, fn) {
        Planner.Plugins.fn[pluginName] = fn;
    };

    Planner.Plugins.call = function(pluginName, context, params) {
        var fn = Planner.Plugins.fn[pluginName];

        if (typeof fn === 'function') {
            fn.apply(context, params);
        } else {
            throw new Error('Chosen plugin is not available: ' + pluginName);
        }
    };

})(Planner);
