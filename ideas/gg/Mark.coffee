Mark = ->
  #TODO use singleton so no new objects are created
  x: (@_x) -> @
  y: (@_y) -> @
  _size: 0.01
  size: (@_size) -> @
  render: (ctx, w, h) ->
    #TODO use Viewport abstraction
    x = @_x * w
    y = h - @_y * h
    radius = @_size * (w + h) / 4
    ctx.beginPath()
    ctx.arc x, y, radius, 0, 2*Math.PI
    ctx.closePath()
    ctx.fill()

module.exports = Mark
