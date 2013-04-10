# Match
# =====
#
# Lets us approximate Haskell's pattern matching syntax in CoffeeScript.
define [], ->
  match = (property, fns, fnName = 'obj') ->
    (obj) ->
      fn = fns[obj[property]]
      if fn
        # fn.apply is used ( instead of `fn(tree)`)
        # so matched functions can take many arguments.
        fn.apply null, arguments
      else
        throw Error "no match for #{fnName}.#{property} = #{tree.type}"

  Model = Backbone.Model
  Collection = Backbone.Collection

  BufferedComponent = Component.extend
    initialize: ->
      if !@get 'component'
        throw Error """ BufferedComponent constructor
          expects a `component` property, which was not given """
      (@get 'component').on 'graphicsDirty', =>
        @trigger 'graphicsDirty'

  LinearContainer = Component.extend()

# `ViewportContainer`
#
#   * `viewport`:`Viewport`
  ViewportContainer = Component.extend()

# `MarkSet`
#
#  * `relation`:`Relation`
#  * `generator`: -> (`Relation`) -> MarkIterator
  MarkSet = ViewportContainer.extend()

# `MarkIterator`
#
#   * `hasNext`: -> Boolean
#   * `next`: -> Mark

# `Relation`
#
#   * `tuples`: Collection<`Tuple`> - rows
#   * `attributes`: Collection<`Attribute`> - columns
#
# with rows (`tuples`) and columns (`attributes`).
# The terms "tuple" and "attribute" are used because
# they are the norm in literature on relational algebra.
  Relation = Model.extend
    initialize: () ->
      @tuples =    new Collection model: Tuple
      @attributes = new Collection model: Attribute

    addAttribute: (name) -> @attributes.add new Attribute {name}
    addTuple: (values) -> @tuples.add new Tuple {values}
    computeMinMax: () -> @attributes.each (attribute) =>
      i = attribute.index
      attribute.set
        min: @tuples.min (tuple) -> tuple.values[i]
        max: @tuples.max (tuple) -> tuple.values[i]

# `Tuple`
#
#  * `values`: a JS Array of literal values (strings or numbers)
  Tuple = Model.extend()

# `Attribute`
#
#   * `name`: String
#   * `min`: Number
#   * `max`: String
#   * `index`: Integer - the tuple index of this attribute
#
# TODO move min/max computation our into a relational
# algebra aggregation operator
  Attribute = Model.extend()

# `Viewport`
# 
#   * `src`: Rectangle
#   * `dest`: Rectangle
  Viewport = Model.extend
    srcToDestPoint: (srcPoint, outDestPoint) ->
    srcToDestRect: (srcRect, outDestRect) ->
    project: alias @ 'srcToDestRect'
    destToSrcPoint: (destPoint, outSrcPoint) ->
    destToSrcRect: (destRect, outSrcRect) ->

  alias = (_this, method) ->
    -> _this[method].call arguments

# `mark`
#
# A visual mark API that never creates new objects.
#
# Example usage:
#
#     code
#     code
   
  mark = (->
    mark = ->
      _.extend properties defaults
      return singleton

    properties = {}

    defaults =
      bounds: new Rectangle
      fillStyle: 'black'
      shape: 'square'
      rotation: 0

    singleton =

      # Chainable property setter functions
      shape:     (   shape   ) -> properties.shape = shape;            @
      fillStyle: (cssColorStr) -> properties.fillStyle = cssColorStr;  @
      bounds:    (x, y, w, h ) -> properties.bounds.setAll x, y, w, h; @
      position:  (   x, y    ) -> properties.bounds.position.set x, y; @
      size:      (  w, h = w ) -> properties.bounds.size.set w, h;     @
      x:         (     x     ) -> properties.bounds.position.x = x;    @
      y:         (     y     ) -> properties.bounds.position.y = y;    @
      w:         (     w     ) -> properties.bounds.size.w = w;        @
      h:         (     h     ) -> properties.bounds.size.h = h;        @
      rotation:  (  rotation ) -> properties.rotation = rotation;      @

      # Functions that evaluate the mark
      getBounds: (             ) -> shape().bounds()
      render:    (ctx, viewport) -> shape().render(ctx, viewport)

    shape = ->
      if !shapes[properties.shape]
        throw Error "Unknown shape type '#{properties.shape}'"
      shapes[properties.shape]

    shapes =
      square:
        bounds: -> properties.bounds.clone()
        render: (ctx, viewport) ->
          ctx.fillStyle = properties.fillStyle
          bounds = viewport.project properties.bounds
          ctx.fillRect(
            bounds.position.x,
            bounds.position.y,
            bounds.size.w,
            bounds.size.h
          )

    return mark
  )()

  ScatterPlot = MarkSet.extend
    initialize: ->
      expectProperties 'xAttr', 'yAttr'
    generator: (relation) ->
      tuples = relation.iterator()

      hasNext: -> tuples.hasNext()
      next: ->
        tuple = tuples.next()
        x = (@get 'xAttr').index
        y = (@get 'yAttr').index
        mark()
          .x    tuple[x]
          .y    tuple[y]

  expectProperties = (_this, properties...) ->
    _.each properties, (property) ->
      if !_this.get property
        throw Error """ Missing expected property
          '#{property}' in constructor call."""
