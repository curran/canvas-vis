require = {
  paths: {
    // To get a canvas-vis module `Foo`, use
    // `require('cv/Foo', function(Foo){ ... }`
    'cv': '../js',
    'requestAnimFrame': '../lib/requestAnimFrame',
  },
  // This prevents caching during development
  urlArgs: "cacheBust=" +  (new Date()).getTime()
};
