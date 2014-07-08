;(function(Plugins, Utils) { 'use strict';

    Plugins.fn = [];
    Plugins.registered = [];
    Plugins.loaded = [];
    Plugins.DEFAULTS = {};

    // Register plugins callback
    // -------------------------

    Plugins.load = function(pluginsList, context) {
        Plugins.registered = pluginsList;
        if (typeof pluginsList.forEach === 'function') {
            pluginsList.forEach(function(pluginName) {
                Plugins.call(pluginName, context);
            });
        } else {
            throw new Error('"Plugins" option on Planner.js should be a list of string');
        }
    };

    Plugins.register = function(pluginName, fn) {
        // During plugin registration, store all plugins DEFAULTS so it's fast to
        // reuse them during instance creation
        Plugins.DEFAULTS = Utils.extend({}, Plugins.DEFAULTS, fn.DEFAULTS);
        Plugins.fn[pluginName] = fn;
    };

    Plugins.call = function(pluginName, context, params) {
        var fn = Plugins.fn[pluginName];

        if (typeof fn === 'function') {
            context.plugins = context.plugins || {};
            context.plugins[pluginName] = new (fn.bind(context, context.element, context.options, params));
            Plugins.loaded[pluginName] = true;
        } else {
            throw new Error('Chosen plugin is not available: ' + pluginName);
        }
    };

    Plugins.isRegistered = function(pluginName) {
        return Plugins.registered.indexOf(pluginName) !== -1;
    };

    Plugins.requires = function(pluginName) {
        if (!Plugins.loaded[pluginName]) {
            throw new Error('"' + pluginName + '" plugin is required.');
        }

        return true;
    };

})(Planner.Plugins = Planner.Plugins || {}, Planner.Utils);
