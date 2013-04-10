# <canvas id="redCanvas"></canvas>
# <h1>Hello</h1>
require ['cv/Component', 'cv/bindToCanvas'], (Component, bindToCanvas) ->
  component = new Component
  
    paint: (ctx, bounds) ->

      ctx.fillStyle = 'red'
      ctx.fillRect(
        bounds.x,
        bounds.y,
        bounds.w,
        bounds.h
      )

  return bindToCanvas 'redCanvas', component

#  <script src="../lib/underscore.js"></script>
#  <script src="../lib/backbone.js"></script>
#  <!-- Configure and load Require.js -->
#  <script>
#  require = {
#    paths: {
#      // To get a canvas-vis module `Foo`, use
#      // `require('cv/Foo', function(Foo){ ... }`
#      'cv': '../js',
#      'requestAnimFrame': '../lib/requestAnimFrame',
#    },
#    // This prevents caching during development
#    urlArgs: "cacheBust=" +  (new Date()).getTime()
#  };
#  </script>
#  <script src="../lib/require-jquery.js"></script>
#  <script src="../lib/coffee-script.js"></script>
#  <script type="text/coffeescript" src="redCanvas.coffee"> </script>
