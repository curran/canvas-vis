require = {
  paths: {
    // To get a canvas-vis module `Foo`, use
    // `require('cv/Foo', function(Foo){ ... }`
    'cv': '../js',
    'requestAnimFrame': '../lib/requestAnimFrame',
    'jquery.csv': '../lib/jquery.csv',
    'text': '../lib/text'
  },
  // This prevents caching during development
  urlArgs: "cacheBust=" +  (new Date()).getTime()
};
