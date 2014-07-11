;(function(Plugins, Utils) { 'use strict';

    Plugins.DEFAULTS = {};
    Plugins.registry = {};
    Plugins.loaded = {};

    // Register plugins callback
    // -------------------------

    Plugins.load = function(pluginsList, context) {
        if (Array.isArray(pluginsList)) {
            for (var i = 0; i < pluginsList.length; i++) {
                Plugins.call(pluginsList[i], context);
            }
        } else {
            throw new Error('"Plugins" option on Planner.js should be a list of string');
        }
    };

    Plugins.register = function(pluginName, fn) {
        // During plugin registration, store all plugins DEFAULTS so it's fast to
        // reuse them during instance creation
        Plugins.DEFAULTS = Utils.extend({}, Plugins.DEFAULTS, fn.DEFAULTS);
        Plugins.registry[pluginName] = fn;
    };

    Plugins.call = function(pluginName, context, params) {
        var fn = Plugins.registry[pluginName];

        if (typeof fn === 'function') {
            context.plugins = context.plugins || {};
            context.plugins[pluginName] = new (fn.bind(context, context.element, context.options, context, params));
            Plugins.loaded[pluginName] = true;
        } else {
            throw new Error('Chosen plugin is not available: ' + pluginName);
        }
    };

    // TODO: check the instance and not the registry
    Plugins.isRegistered = function(pluginName) {
        return typeof Plugins.registry[pluginName] !== 'undefined';
    };

  // TODO: check the instance and not the registry
    Plugins.requires = function(pluginName) {
        if (!Plugins.loaded[pluginName]) {
            throw new Error('"' + pluginName + '" plugin is required.');
        }

        return true;
    };

})(Planner.Plugins = Planner.Plugins || {}, Planner.Utils);
