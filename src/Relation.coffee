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
      @attrCounter = 0
    addAttribute: (name) ->
      attribute = new Attribute
        name: name
        index: @attrCounter++
      @attributes.add attribute
      return attribute
    addTuple:   (values) ->
      @tuples.add new Tuple {values}
    computeMinMax: ->
      @attributes.each (attr) =>
        minTuple = @tuples.min (tuple) -> tuple.value attr
        maxTuple = @tuples.max (tuple) -> tuple.value attr
        # min/maxTuple gets Infinity when there are no numbers
        if minTuple != Infinity
          attr.min = minTuple.value attr
          attr.max = maxTuple.value attr
    select: (test) ->
      result = new Relation
      result.attributes = @attributes
      result.tuples.add @tuples.filter test
      return result
    project: (attributes) ->
      result = new Relation
      result.attributes.add attributes
      result.tuples = @tuples
      return result

# Relation.Tuple
# --------------
#
#   * values: an object mapping attribute names to their values.
  Tuple = Backbone.Model.extend
    initialize: -> expose @, 'values'
    value: (attr) -> @.values[attr.index]

# Relation.Attribute
# ------------------
#
#   * `name`: String
#   * `min`: Number
#   * `max`: Number
  Attribute = Backbone.Model.extend
    initialize: -> expose @, 'name', 'min', 'max', 'index'

  Relation.Attribute = Attribute
  Relation.Tuple = Tuple
  return Relation
