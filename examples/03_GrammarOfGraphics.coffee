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
    tree = grammarOfGraphics variables, expr

#TODO this is a hack
    window.tree = tree
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

