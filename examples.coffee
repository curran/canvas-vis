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
# <canvas id="scatterPlot" width="450" height="450"></canvas>
require ['cv/Component', 'cv/bindToCanvas', 'cv/readCSV',
         'cv/Viewport', 'cv/Rectangle', 'cv/Point']
      , (Component, bindToCanvas, readCSV,
         Viewport, Rectangle, Point) ->

  readCSV '../data/iris.csv', (err, relation) ->
    xAttr = relation.attributes.at 0
    yAttr = relation.attributes.at 1

    srcPt = new Point
    destPt = new Point

    viewport = new Viewport
      src: new Rectangle
        x: xAttr.min
        y: yAttr.min
        w: xAttr.max - xAttr.min
        h: yAttr.max - yAttr.min
      dest: new Rectangle
    component = new Component
      paint: (ctx, bounds) ->
        viewport.dest.copy bounds
        relation.tuples.each (tuple) ->
          srcPt.x = tuple.values[xAttr.name]
          srcPt.y = tuple.values[yAttr.name]
          viewport.srcToDest srcPt, destPt
          ctx.fillRect destPt.x, destPt.y, 5, 5

    bindToCanvas 'scatterPlot', component

# Roadmap
# =======
#
#   * Bertin example from p.43
#   * Nested Components example
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
