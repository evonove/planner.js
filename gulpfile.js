var gulp = require('gulp');

var wheelie = require('wheelie');
var recipe = require('wheelie-recipe');

wheelie.add(recipe);
wheelie.setDefault('watch');
wheelie.build();
