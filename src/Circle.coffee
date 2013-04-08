define ['cv/Component'], (Component) ->
  create: (x, y, radius) ->
    circle = Component.create
      paint: (ctx, bounds) ->
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.arc bounds.centerX, bounds.centerY
              , (bounds.w + bounds.h) / 4
              , 0, 2 * Math.PI, false
        ctx.fill()
    circle.getBoundingBox = (boundingBox) ->
      r2 = radius * 2
      boundingBox.set x-radius, y-radius, r2, r2
    return circle
