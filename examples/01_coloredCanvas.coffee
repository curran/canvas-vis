# [Colored Canvas](../examples/01_coloredCanvas.html)
# --------------
# <canvas id="coloredCanvas"></canvas>
#
# An example of
#
#   * Creating a `Component`
#   * Defining its `paint` method
#   * Using the `graphicsDirty` event to schedule repainting
#   * Binding a component to a Canvas
require ['cv/Component', 'cv/bindToCanvas'], (Component, bindToCanvas) ->

  component = new Component
    paint: (ctx, bounds) ->
      ctx.fillStyle = randomColor()
      ctx.fillRect bounds.x, bounds.y, bounds.w, bounds.h

  randomColor = -> "rgb(#{r()},#{r()},#{r()})"
  r = -> Math.floor(Math.random() * 255)

  setInterval (-> component.trigger 'graphicsDirty'), 1000

  bindToCanvas 'coloredCanvas', component
