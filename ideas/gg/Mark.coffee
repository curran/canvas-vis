Mark = ->
  x: (@_x) -> @
  y: (@_y) -> @
  _size: 0.01
  size: (@_size) -> @
  render: (ctx, w, h) ->
    x = @_x * w
    y = @_y * h
    radius = @_size * (w + h) / 4
    ctx.beginPath()
    ctx.arc x, y, radius, 0, 2*Math.PI
    ctx.closePath()
    ctx.fill()

module.exports = Mark
