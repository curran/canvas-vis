define ['cv/Component'], (Component) ->
  create: (x, y, radius) ->
    Component.create
      paint: (ctx, bounds) ->
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.arc bounds.centerX, bounds.centerY
              , (bounds.w + bounds.h) / 4
              , 0, 2 * Math.PI, false
        ctx.fill()
