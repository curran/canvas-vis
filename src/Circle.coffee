define ['cv/Component'], (Component) ->
  Backbone.Model.extend
    paint: (ctx, bounds) ->
      ctx.fillStyle = 'black'
      ctx.beginPath()
      ctx.arc bounds.centerX, bounds.centerY
            , (bounds.w + bounds.h) / 4
            , 0, 2 * Math.PI, false
      ctx.fill()
    getBoundingBox: (boundingBox) ->
      x = @get 'x'
      y = @get 'y'
      radius = @get 'radius'
      r2 = radius * 2
      boundingBox.set x-radius, y-radius, r2, r2
