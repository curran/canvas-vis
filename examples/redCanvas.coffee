require ['cv/Component'], (Component) ->
  component = Component.create
    paint: (ctx, bounds) ->
      ctx.fillStyle = 'red'
      ctx.fillRect bounds.x, bounds.y, bounds.w, bounds.h
  Component.bindToCanvas 'redCanvas', component
