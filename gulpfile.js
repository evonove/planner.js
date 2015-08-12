var gulp = require('gulp');

var wheelie = require('wheelie');
var recipe = require('wheelie-recipe');


wheelie.add(recipe);
wheelie.setDefault('watch');

// appending JavaScript files
var vendors = [
  'handlebars/handlebars.runtime.js',
  'ds.js/dist/hashmap.js',
  'ds.js/dist/set.js',
  'messengerjs/dist/messenger.js'
];

var scripts = [
  'models/models.js',
  'planner.js',
  'compat/modernizr.js',
  'instance.js',
  'utils.js',
  'helpers/generic.js',
  'helpers/instance.js',
  'helpers/card.js',
  'models/card.js',
  'templates.js',
  'plugins/manager.js',
  'plugins/slider.js',
  'plugins/collision.js',
  'plugins/mobile.js',
  'plugins/hourline.js',
  'plugins/interaction/interaction.js',
  'plugins/interaction/actions/create.js',
  'plugins/interaction/actions/drag.js',
  'plugins/interaction/actions/interaction.js',
  'plugins/interaction/actions/resize.js',
  'plugins/interaction/handlers/mouse.js',
  'plugins/interaction/handlers/drag.js',
  'plugins/interaction/handlers/touch.js',
  'main.js'
];

// tasks configurations
wheelie.registry.get('uglify').dependencies = ['handlebars'];
wheelie.update('handlebars', { namespace: 'Planner.Templates' });
wheelie.update('uglify', {
  scripts: scripts,
  vendors: vendors,
  outputName: 'planner.js'
});

wheelie.build();
