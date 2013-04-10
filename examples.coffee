# Colored Canvas
# ==============
# <canvas id="coloredCanvas"></canvas>
#
# An example of
#
#   * Creating a `Component`
#   * Defining its `paint` method
#   * Using the `graphicsDirty` event to schedule repainting
#   * Binding a component to a Canvas
require ['cv/Component', 'cv/bindToCanvas'], (Component, bindToCanvas) ->

  component = new Component
    paint: (ctx, bounds) ->
      ctx.fillStyle = randomColor()
      ctx.fillRect bounds.x, bounds.y, bounds.w, bounds.h

  randomColor = -> "rgb(#{r()},#{r()},#{r()})"
  r = -> Math.floor(Math.random() * 255)

  setInterval (-> component.trigger 'graphicsDirty'), 1000

  bindToCanvas 'coloredCanvas', component

# Scatter Plot
# ==============
# <canvas id="scatterPlot" width="400" height="200"></canvas>
require ['cv/Component', 'cv/bindToCanvas', 'cv/readCSV'] , (Component, bindToCanvas, readCSV) ->

  #  markIterator = (relation) ->
  #    xAttr = relation.attributes.at 0
  #    yAttr = relation.attributes.at 1
  #    tuples = relation.iterator()
  #    hasNext: -> tuples.hasNext()
  #    next: ->
  #      tuple = tuples.next()
  #      mark()
  #        .x tuple[x]
  #        .y tuple[y]
  #
  relation = readCSV '../data/iris.csv'
  #
  component = new Component
    paint: (ctx, bounds) ->
      ctx.fillStyle = 'red'
      ctx.fillRect bounds.x, bounds.y, bounds.w, bounds.h
      #      iterator = marks relation
      #      while iterator.hasNext()
      #        mark = iterator.next()
      #        mark.paint ctx, viewport

  bindToCanvas 'scatterPlot', component


# Roadmap
# =======
#
#   * Bertin example from p.43
#   * Nested Components example
#   * Scatter Plot of Iris Data
#   * Timeline of Population Data
#   * Pan & Zoom example
#   * Zoomable Scatter Plot of Iris Data
#   * Zoomable Timeline of Population Data (A)
#   * Parallel Coordinates of Iris Data (B)
#   * Brushing & Linking Example containing A and B
#   * Map of labeled US counties using Quadstream (C)
#   * Zoomable Choropleth Map
#   * Color Maps
#   * HeatMap

#  <script src="../lib/underscore.js"></script>
#  <script src="../lib/backbone.js"></script>
#  <script src="../lib/coffee-script.js"></script>
#  <script src="../requireConfig.js"> </script>
#  <script src="../lib/require-jquery.js"></script>
#  <script type="text/coffeescript" src="../examples.coffee"> </script>
