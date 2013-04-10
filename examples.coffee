# Colored Canvas
# ==============
# <canvas id="coloredCanvas"></canvas>
#
# An example of
#
#   * Creating a `Component`
#   * Defining its `paint` method
#   * Binding it to a Canvas
require ['cv/Component', 'cv/bindToCanvas'], (Component, bindToCanvas) ->
  component = new Component
    paint: (ctx, bounds) ->
      ctx.fillStyle = randomColor()
      ctx.fillRect bounds.x, bounds.y, bounds.w, bounds.h
  randomColor = -> "rgb(#{r()},#{r()},#{r()})"
  r = -> Math.floor(Math.random() * 255)
  bindToCanvas 'coloredCanvas', component

# Roadmap
# =======
#
#   * Bertin example from p.43
#   * Nested Components example
#   * Scatter Plot of Iris Data
#   * Parallel Coordinates of Iris Data
#   * Timeline of Population Data
#   * Choropleth Map of US counties using Quadstream

#  <script src="../lib/underscore.js"></script>
#  <script src="../lib/backbone.js"></script>
#  <script src="../lib/coffee-script.js"></script>
#  <script src="../requireConfig.js"> </script>
#  <script src="../lib/require-jquery.js"></script>
#  <script type="text/coffeescript" src="../examples.coffee"> </script>
