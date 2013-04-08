define ['cv/Container', 'cv/Viewport',
        'cv/Rectangle', 'underscore']
     , (Container, Viewport, Rectangle, _) ->
  add = (superAdd, child) ->
    if not child.getBoundingBox then throw Error """
      ViewportContainer.add(child) expects 
      child.getBoundingBox, a Rectangle to be projected 
      from the viewport source bounds to the display 
      bounds before calling child.paint().
    """
    superAdd child
  create: ->
    container = viewport: Viewport.create()
    _.extend container, Container.create
      paint: (ctx, bounds) ->
        @viewport.dest = bounds
        @each (child) =>
          child.paint ctx, @viewport.srcToDestRect child.bounds
    container.add = _.wrap container.add, add
    return container
