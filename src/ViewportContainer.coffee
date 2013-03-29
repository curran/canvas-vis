define ['cv/Container', 'cv/Viewport', 'underscore']
     , (Container, Viewport, _) ->
  create: ->
    container = Container.create
      paint: (ctx, bounds) ->
        @each (child) ->
          child.paint ctx, bounds
