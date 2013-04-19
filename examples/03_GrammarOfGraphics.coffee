# [Grammar of Graphics](../examples/03_GrammarOfGraphics.html)
# ------------------------------------------------------------
# <canvas id="grammarOfGraphics" width="450" height="450"></canvas>
# <textarea rows="20" cols="40" id="expressionBox">loading...</textarea>
# <div style="color:red" id='errorDiv'></div>
require ['cv/Component', 'cv/bindToCanvas', 'cv/readCSV',
         'cv/Viewport', 'cv/Rectangle', 'cv/mark','cv/grammarOfGraphics']
      , (Component, bindToCanvas, readCSV,
         Viewport, Rectangle, mark, grammarOfGraphics) ->

  initialExpr = """
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
    [keys, scales, keyToMark] = grammarOfGraphics.execute variables, initialExpr

    viewport = new Viewport

    GGComponent = Component.extend
      paint: (ctx, bounds) ->
        ctx.clearRect 0, 0, bounds.w, bounds.h
        viewport.dest.copy bounds
        for key in keys
          (keyToMark key, scales).render ctx, viewport

    component = new GGComponent

    bindToCanvas 'grammarOfGraphics', component

    changeExpr = (expr)->
      [keys, scales, keyToMark] = grammarOfGraphics.execute variables, expr
      component.trigger 'graphicsDirty'

    expressionBox.value = initialExpr
    expressionBox.addEventListener 'input', ->
      try
        errorDiv.innerHTML = ''
        changeExpr expressionBox.value
      catch error
        errorDiv.innerHTML = error
