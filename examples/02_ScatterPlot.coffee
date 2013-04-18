# [Scatter Plot](../examples/02_ScatterPlot.html)
# --------------
# <canvas id="scatterPlot" width="450" height="450"></canvas>
require ['cv/Component', 'cv/bindToCanvas', 'cv/readCSV',
         'cv/Viewport', 'cv/Rectangle', 'cv/Varset', 'cv/Scale', 'cv/mark']
      , (Component, bindToCanvas, readCSV,
         Viewport, Rectangle, Varset, Scale, mark) ->

  readCSV '../data/iris.csv', (err, columns) ->
    xVar = Varset.fromVariable columns['petal length']
    yVar = Varset.fromVariable columns['sepal length']
    varset = Varset.cross xVar, yVar

    scales = [new Scale(1), new Scale(2)]
    scale.init varset for scale in scales

    ScatterPlot = Component.extend
      paint: (ctx, bounds) ->
        viewport.dest.copy bounds
        for tuple in varset.tuples()
          (point position tuple).render ctx, viewport

    position = (tuple) ->
      mark()
        .x(scales[0].value tuple)
        .y(scales[1].value tuple)

    point = (mark) ->
      mark.size(0.05)
          .shape('circle')
          .fillStyle('rgba(0,0,0,0.2)')

    viewport = new Viewport

    bindToCanvas 'scatterPlot', new ScatterPlot
