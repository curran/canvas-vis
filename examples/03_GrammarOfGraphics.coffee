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
    [keys, scales, keyToMark] = grammarOfGraphics.execute variables, expr

    viewport = new Viewport

    GGComponent = Component.extend
      paint: (ctx, bounds) ->
        viewport.dest.copy bounds
        for key in keys
          (keyToMark key, scales).render ctx, viewport

    bindToCanvas 'grammarOfGraphics', new GGComponent

