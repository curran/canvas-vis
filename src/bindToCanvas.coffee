# bindToCanvas
# ============
#
# Binds a Component to a Canvas.
#
# The component is re-rendered on the Canvas whenever it fires a 'graphicsDirty' event.
define ['requestAnimFrame', 'cv/Rectangle']
       ,(requestAnimFrame,      Rectangle) ->
  (canvasId, component) ->
    canvas = document.getElementById canvasId
    if not canvas then throw Error "Invalid Canvas ID: '#{canvasId}'"

    ctx = canvas.getContext '2d'

    bounds = new Rectangle
      x: 0
      y: 0
      w: canvas.width
      h: canvas.height

    graphicsDirty = true
    component.on 'graphicsDirty', -> graphicsDirty = true

    executeFrame = () ->
      if graphicsDirty
        bounds.w = canvas.width
        bounds.h = canvas.height
        component.paint ctx, bounds
        graphicsDirty = false
      requestAnimFrame executeFrame

    executeFrame()
