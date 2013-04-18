# MarkIterator
# ============
#
#   * `hasNext`: -> Boolean
#   * `next`: -> Mark

# mark
# ====
#
# An API for Jaque Bertin's notion of visualization "marks".
define ['cv/Rectangle', 'cv/Point']
     , (Rectangle, Point) ->

  mark = ->
    _.extend p, defaults
    return singleton

  # p means properties
  p = {}

  defaults =
    bounds: new Rectangle
    fillStyle: 'black'
    shape: 'square'
    rotation: 0

  singleton =

    # Chainable property setter functions
    shape:     (   shape   ) -> p.shape = shape;            @
    fillStyle: (cssColorStr) -> p.fillStyle = cssColorStr;  @
    size:      (  w, h = w ) ->
      p.bounds.w = w; p.bounds.h = h;                       @
    x:         (     x     ) -> p.bounds.x = x;             @
    y:         (     y     ) -> p.bounds.y = y;             @
    w:         (     w     ) -> p.bounds.w = w;             @
    h:         (     h     ) -> p.bounds.h = h;             @
    rotation:  (  rotation ) -> p.rotation = rotation;      @

    # Functions that evaluate the mark
    getBounds: ->
      shape().bounds()
    render: (ctx, viewport) ->
      shape().render(ctx, viewport)

  shape = ->
    if !shapes[p.shape]
      throw Error "Unknown shape type '#{p.shape}'"
    shapes[p.shape]


  shapes =
    square:
      bounds: -> p.bounds.clone()
      render: (ctx, viewport) ->
        ctx.fillStyle = p.fillStyle
        viewport.srcToDestRect p.bounds, destRect
        ctx.fillRect(
          destRect.x,
          destRect.y,
          destRect.w,
          destRect.h
        )
    circle:
      bounds: -> p.bounds.clone()
      render: (ctx, viewport) ->
        ctx.fillStyle = p.fillStyle
        viewport.srcToDestRect p.bounds, destRect
        x = destRect.x + destRect.w/2
        y = destRect.y + destRect.h/2
        r = (destRect.w + destRect.h)/4
        ctx.beginPath()
        ctx.arc x, y, r, 0, 2*Math.PI
        ctx.fill()
        ctx.closePath()

  destRect = new Point

  return mark
