# [Scatter Plot](../examples/02_ScatterPlot.html)
# --------------
# <canvas id="scatterPlot" width="450" height="450"></canvas>
require ['cv/Component', 'cv/bindToCanvas', 'cv/readCSV',
         'cv/Viewport', 'cv/Rectangle', 'cv/mark']
      , (Component, bindToCanvas, readCSV,
         Viewport, Rectangle, mark) ->

  readCSV '../data/iris.csv', (err, variables) ->
    xVar = variables['petal length']
    yVar = variables['sepal length']

    ScatterPlot = Component.extend
      paint: (ctx, bounds) ->
        viewport.dest.copy bounds
        keys = xVar.keys()
        for key in keys
          mark()
            .x(xVar.value key)
            .y(yVar.value key)
            .size(0.1)
            .fillStyle('rgba(0,0,0,0.2)')
            .render ctx, viewport

    xMin = _.min xVar.values()
    xMax = _.max xVar.values()
    yMin = _.min yVar.values()
    yMax = _.max yVar.values()

    viewport = new Viewport
      src: new Rectangle
        x: xMin
        y: yMin
        w: xMax - xMin
        h: yMax - yMin
      dest: new Rectangle

    bindToCanvas 'scatterPlot', new ScatterPlot
