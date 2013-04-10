# Relation
# ========
# [benchmark of object tuples vs. array tuples](http://jsperf.com/relations)
#
#   * attributes:Collection<Relation.Attribute>
#   * tuples:Collection<Relation.Tuple>
define ['cv/expose'], (expose) ->
  Relation = Backbone.Model.extend
    initialize: ->
      @attributes = new Backbone.Collection
      @tuples     = new Backbone.Collection
    addAttribute: (name) -> @attributes.add new Attribute {name}
    addTuple:   (values) -> @tuples.add new Tuple {values}
    computeMinMax: () -> @attributes.each (attribute) =>
      i = attribute.index
      attribute.set
        min: @tuples.min (tuple) -> tuple.values[i]
        max: @tuples.max (tuple) -> tuple.values[i]
    select: (test) ->
      result = new Relation
      @attributes.each (attr) -> result.addAttribute attr.name
      result.tuples.add @tuples.filter (tuple) -> test tuple.values
      return result
    project: (attrNames) ->
      result = new Relation
      result.addAttribute name for name in attrNames
      @tuples.each (tuple) ->
        result.addTuple _.pick tuple.values, attrNames
      return result

# Relation.Tuple
# --------------
#
#   * values: an object mapping attribute names to their values.
  Tuple = Backbone.Model.extend
    initialize: -> expose @, 'values'

# Relation.Attribute
# ------------------
#
#   * `name`: String
#   * `min`: Number
#   * `max`: Number
  Attribute = Backbone.Model.extend
    initialize: -> expose @, 'name', 'min', 'max'

  Relation.Attribute = Attribute
  Relation.Tuple = Tuple
  return Relation
