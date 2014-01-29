;(function(Planner) { 'use strict';

    Planner.Plugins = Planner.Plugins || {};
    Planner.Plugins.fn = [];
    Planner.Plugins.loaded = [];

    // Register plugins callback
    // -------------------------

    Planner.Plugins.register = function(pluginName, fn) {
        Planner.Plugins.fn[pluginName] = fn;
    };

    Planner.Plugins.call = function(pluginName, context, params) {
        var fn = Planner.Plugins.fn[pluginName];

        if (typeof fn === 'function') {
            fn.apply(context, params);
            Planner.Plugins.loaded[pluginName] = true;
        } else {
            throw new Error('Chosen plugin is not available: ' + pluginName);
        }
    };

    Planner.Plugins.require = function(pluginName) {
        if (!Planner.Plugins.loaded[pluginName]) {
            throw new Error('"' + pluginName + '" plugin is required.');
        }

        return true;
    };

})(Planner);
