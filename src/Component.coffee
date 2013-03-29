# A `Component` is an object responsible for rendering and managing
# interaction events for a rectangular region of a canvas.
#
# `Component.create` expects an `options` argument with:
#
#  * `paint: function(ctx, bounds){...}` 
#    The function that paints the component.
#    * `ctx` is a Canvas context
#    * `bounds` is a `Rectangle` object defining the bounding
#      box (in pixels) where the component should be drawn.
#
define ['underscore', 'backbone', 'requestAnimFrame', 'cv/Rectangle']
     , (_, Backbone, requestAnimFrame, Rectangle) ->
  create: (options) ->
    _.extend new Backbone.Model, options
  bindToCanvas: (canvasId, component) ->
    canvas = document.getElementById canvasId
    if not canvas then throw Error "Invalid Canvas ID: '#{canvasId}'"
    ctx = canvas.getContext '2d'
    bounds = Rectangle.create 0, 0, canvas.width, canvas.height
    graphicsDirty = true
    component.on 'graphicsDirty', () ->
      graphicsDirty = true
    executeFrame = () ->
      if graphicsDirty
        component.paint ctx, bounds
        graphicsDirty = false
      requestAnimFrame executeFrame
    executeFrame()
