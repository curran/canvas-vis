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
