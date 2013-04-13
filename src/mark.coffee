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

  # p = p
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
#    bounds:    (x, y, w, h ) -> p.bounds.setAll x, y, w, h; @
#    position:  (   x, y    ) -> p.bounds.position.set x, y; @
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


  # TODO change this, remove these temp points
  srcPt = new Point
  destPt = new Point

  shapes =
    square:
      bounds: -> p.bounds.clone()
      render: (ctx, viewport) ->
        ctx.fillStyle = p.fillStyle
        srcPt.x = p.bounds.x
        srcPt.y = p.bounds.y
        viewport.srcToDest srcPt, destPt
# TODO update this to use p.bounds.(w, h)
        ctx.fillRect(
          destPt.x,
          destPt.y,
          5, 5
        )

  return mark
