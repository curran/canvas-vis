# [Scatter Plot](../examples/02_ScatterPlot.html)
# --------------
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
          srcPt.x = tuple.value(xAttr)
          srcPt.y = tuple.value(yAttr)
          viewport.srcToDest srcPt, destPt
          ctx.fillRect destPt.x, destPt.y, 5, 5

    bindToCanvas 'scatterPlot', component
