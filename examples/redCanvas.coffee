require ['cv/Component'], (Component) ->
  component = new Component
    paint: (ctx, bounds) ->
      ctx.fillStyle = 'red'
      ctx.fillRect bounds.x, bounds.y, bounds.w, bounds.h
  Component.bindToCanvas 'redCanvas', component
