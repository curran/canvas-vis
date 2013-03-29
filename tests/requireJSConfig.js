// This is the configuration file for Require.js.
require = {
  paths: {
    // To get a canvas-vis module `Foo`, use
    // `require('cv/Foo', function(Foo){ ... }`
    'cv': '../js',
    'underscore': '../lib/underscore',
    'backbone': '../lib/backbone',
    'requestAnimFrame': '../lib/requestAnimFrame',
  },
  // This prevents caching during development
  urlArgs: "cacheBust=" +  (new Date()).getTime()
};
