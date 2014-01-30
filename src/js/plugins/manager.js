;(function(Planner) { 'use strict';

    Planner.Plugins = Planner.Plugins || {};
    Planner.Plugins.fn = [];
    Planner.Plugins.registered = [];
    Planner.Plugins.loaded = [];

    // Register plugins callback
    // -------------------------

    Planner.Plugins.load = function(pluginsList, context) {
        Planner.Plugins.registered = pluginsList;
        if (typeof pluginsList.forEach === 'function') {
            pluginsList.forEach(function(pluginName) {
                Planner.Plugins.call(pluginName, context);
            });
        } else {
            throw new Error('"Plugins" option on Planner.js should be a list of string');
        }
    };

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

    Planner.Plugins.isRegistered = function(pluginName) {
        return Planner.Plugins.registered.indexOf(pluginName) !== -1;
    };

    Planner.Plugins.requires = function(pluginName) {
        if (!Planner.Plugins.loaded[pluginName]) {
            throw new Error('"' + pluginName + '" plugin is required.');
        }

        return true;
    };

})(Planner);
