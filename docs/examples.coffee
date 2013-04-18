# Canvas-Vis Examples
# ===================
#
# This docrment is a collection of examples that use the Canvas-vis library. This file is built from `examples.coffee` in `build.sh`, which uses [Docco](http://jashkenas.github.io/docco/). Because Docco supports [Markdown](http://daringfireball.net/projects/markdown/) with inline HTML in comments, it is possible to execute `examples.coffee` within this document, producing running examples right next to their source code. Enjoy! --Curran Kelleher, April 2013
#
# [Colored Canvas](../examples/01_coloredCanvas.html)
# --------------
# <canvas id="coloredCanvas"></canvas>
#
# An example of
#
#   * Creating a `Component`
#   * Defining its `paint` method
#   * Using the `graphicsDirty` event to schedule repainting
#   * Binding a component to a Canvas
require ['cv/Component', 'cv/bindToCanvas'], (Component, bindToCanvas) ->

  ColoredCanvas = Component.extend
    initialize: ->
      setInterval (=> @trigger 'graphicsDirty'), 1000
    paint: (ctx, bounds) ->
      ctx.fillStyle = randomColor()
      ctx.fillRect bounds.x, bounds.y, bounds.w, bounds.h

  randomColor = -> "rgb(#{r()},#{r()},#{r()})"
  r = -> Math.floor(Math.random() * 255)

  bindToCanvas 'coloredCanvas', new ColoredCanvas
# [Scatter Plot](../examples/02_ScatterPlot.html)
# --------------
# <canvas id="scatterPlot" width="450" height="450"></canvas>
require ['cv/Component', 'cv/bindToCanvas', 'cv/readCSV',
         'cv/Viewport', 'cv/Rectangle', 'cv/Varset', 'cv/mark']
      , (Component, bindToCanvas, readCSV,
         Viewport, Rectangle, Varset, mark) ->

  readCSV '../data/iris.csv', (err, columns) ->
    xVar = Varset.fromVariable columns['petal length']
    yVar = Varset.fromVariable columns['sepal length']
    varset = Varset.cross xVar, yVar

    xs = _.map varset.tuples(), (tuple) -> tuple[0]
    ys = _.map varset.tuples(), (tuple) -> tuple[1]

    xMin = _.min xs
    xMax = _.max xs
    yMin = _.min ys
    yMax = _.max ys
    
    scales = []
    scales.push
      dim: 1
      min: xMin
      max: xMax
    scales.push
      dim: 2
      min: yMin
      max: yMax

    for scale in scales
      _.extend scale,
        value: (tuple) ->
          (tuple[@dim-1] - @min)/(@max - @min)

    ScatterPlot = Component.extend
      paint: (ctx, bounds) ->
        viewport.dest.copy bounds
        for tuple in varset.tuples()
          mark()
            .x(scales[0].value tuple)
            .y(scales[1].value tuple)
            .size(0.1)
            .fillStyle('rgba(0,0,0,0.2)')
            .render ctx, viewport

    viewport = new Viewport

    bindToCanvas 'scatterPlot', new ScatterPlot
# [Grammar of Graphics](../examples/03_GrammarOfGraphics.html)
# ------------------------------------------------------------
# <canvas id="grammarOfGraphics" width="450" height="450"></canvas>
require ['cv/Component', 'cv/bindToCanvas', 'cv/readCSV',
         'cv/Viewport', 'cv/Rectangle', 'cv/mark','cv/grammarOfGraphics']
      , (Component, bindToCanvas, readCSV,
         Viewport, Rectangle, mark, grammarOfGraphics) ->

  expr = """
    DATA: x = "petal length"
    DATA: y = "sepal length"
    TRANS: x = x
    TRANS: y = y
    SCALE: linear(dim(1))
    SCALE: linear(dim(2))
    COORD: rect(dim(1, 2))
    GUIDE: axis(dim(1))
    GUIDE: axis(dim(2))
    ELEMENT: point(position(x*y))
  """

  readCSV '../data/iris.csv', (err, variables) ->
    tree = grammarOfGraphics.execute variables, expr
    console.log grammarOfGraphics.show tree

#TODO this is a hack
    varset = _.last(tree.statements).expr.args[0].args[0]
    window.varset = varset

    xs = _.map varset.tuples(), (tuple) -> tuple[0]
    ys = _.map varset.tuples(), (tuple) -> tuple[1]

    xMin = _.min xs
    xMax = _.max xs
    yMin = _.min ys
    yMax = _.max ys

    viewport = new Viewport
      src: new Rectangle
        x: xMin
        y: yMin
        w: xMax - xMin
        h: yMax - yMin
      dest: new Rectangle

    GGComponent = Component.extend
      paint: (ctx, bounds) ->
        viewport.dest.copy bounds
        for tuple in varset.tuples()
          mark()
            .x(tuple[0])
            .y(tuple[1])
            .size(0.1)
            .fillStyle('rgba(0,0,0,0.2)')
            .render ctx, viewport

    bindToCanvas 'grammarOfGraphics', new GGComponent

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
#  <script type="text/coffeescript" src="examples.coffee"> </script>
