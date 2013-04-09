define ['backbone'], (Backbone) ->

  # This utility lets us approximate Haskell's 
  # pattern matching syntax in CoffeeScript
  match = (property, fns, fnName = 'obj') ->
    (obj) ->
      fn = fns[obj[property]]
      if fn
        # fn.apply is used
        # ( instead of `fn(tree)`)
        # so s can take many arguments.
        fn.apply null, arguments
      else
        throw Error "no match for #{fnName}.#{property} = #{tree.type}"

  Model = Backbone.Model
  Collection = Backbone.Collection

  Component = Model.extend()

  LinearComponent = Component.extend()

  ViewportComponent = Component.extend()

# `MarkSet`
#
#  * `relations`: -> RelationSet
#  * `generator`: -> (RelationSet) -> MarkIterator
  MarkSet = ViewportComponent.extend()

  RelationSet = Collection.extend model: Relation

# A `Relation` is a table 
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
#
# TODO move min/max computation our into a relational
# algebra aggregation operator
  Attribute = Model.extend()

# `MarkIterator`
#
#   * `hasNext`: -> Boolean
#   * `next`: -> Mark
  MarkIterator = Model.extend
    hasNext: ->
    next: ->


# `Point`
# 
#   * `x`: Number
#   * `y`: Number
  Point = Model.extend()

# `Dimension`
# 
#   * `w`: Number
#   * `h`: Number
  Dimension = Model.extend()

# `Rectangle`
# 
#   * `location`: Point
#   * `size`: Dimension
  Rectangle = Model.extend()

# `Viewport`
# 
#   * `src`: Rectangle
#   * `dest`: Rectangle
  Viewport = Model.extend
    srcToDestPoint: (srcPoint, outDestPoint) ->
    srcToDestRect: (srcRect, outDestRect) ->
    destToSrcPoint: (destPoint, outSrcPoint) ->
    destToSrcRect: (destRect, outSrcRect) ->

# A "mark" is Bertin's notion of a single visualization element, comprised of
# 
#  * Position (x, y)
#  * Value (Luminance)
#  * Color (Hue)
#  * Texture
#  * Shape
#  * Orientation
#
# This `mark` module defines a mark API that never creates new objects.
 
mark = (->
  properties = {}

  defaults =
    bounds: new Rectangle
    fillStyle: 'black'
    shape: 'square'

  singleton =
    bounds: (             ) -> shape().bounds()
    render: (ctx, viewport) -> shape().render(ctx, viewport)

  shape = ->
    if !shapes[properties.shape]
      throw Error "Unknown shape type '#{properties.shape}'"
    shapes[properties.shape]

  shapes =
    square:
      bounds: -> properties.bounds.clone()
      render: (ctx, viewport) ->
        ctx.fillStyle = properties.fillStyle
        ctx.fillRect(
          properties.bounds.location.x,
          properties.bounds.location.y,
          properties.bounds.size.w,
          properties.bounds.size.h
        )

  mark = ->
    _.extend singleton defaults
)()
