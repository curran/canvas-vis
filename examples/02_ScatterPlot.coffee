# [Scatter Plot](../examples/02_ScatterPlot.html)
# --------------
# <canvas id="scatterPlot" width="450" height="450"></canvas>
require ['cv/Component', 'cv/bindToCanvas', 'cv/readCSV',
         'cv/Viewport', 'cv/Rectangle', 'cv/Point', 'cv/mark']
      , (Component, bindToCanvas, readCSV,
         Viewport, Rectangle, Point, mark) ->

  readCSV '../data/iris.csv', (err, relation) ->
    xAttr = relation.attributes.at 0
    yAttr = relation.attributes.at 1

    viewport = new Viewport
      src: new Rectangle
        x: xAttr.min
        y: yAttr.min
        w: xAttr.max - xAttr.min
        h: yAttr.max - yAttr.min
      dest: new Rectangle
    ScatterPlot = Component.extend
      paint: (ctx, bounds) ->
        viewport.dest.copy bounds
        relation.tuples.each (tuple) ->
          mark()
            .x(tuple.value xAttr)
            .y(tuple.value yAttr)
            .size(0.1)
            .fillStyle('rgba(0,0,0,0.2)')
            .render ctx, viewport

    bindToCanvas 'scatterPlot', new ScatterPlot
