# Red Canvas
# ==========
# <canvas id="redCanvas"></canvas>
#
# An example of
#
#   * Creating a `Component`
#   * Defining its `paint` method
#   * Binding it to a Canvas
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
#  <script src="../lib/coffee-script.js"></script>
#  <script src="../requireConfig.js"> </script>
#  <script src="../lib/require-jquery.js"></script>
#  <script type="text/coffeescript" src="../examples.coffee"> </script>
