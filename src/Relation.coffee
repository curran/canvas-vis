# Relation
# ========
# [benchmark of object tuples vs. array tuples](http://jsperf.com/relations)
#
define ['cv/expose'], (expose) ->
  Relation = Backbone.Model.extend
    initialize: ->

#   * attributes:Collection[Relation.Attribute]
      @attributes = new Backbone.Collection

#   * tuples:Collection[Relation.Tuple]
      @tuples     = new Backbone.Collection
      
      @attrCounter = 0

#   * addAttribute(name:String) -> Attribute
    addAttribute: (name) ->
      attribute = new Attribute
        name: name
        index: @attrCounter++
      @attributes.add attribute
      return attribute
    attrByName: (name) ->
      @attributes.find (attr) -> attr.name == name

#   * addTuple(values:Array[Numbers or Strings]), 
#   the order of values in the `values` array should
#   correspond to the order that attributes were added.
    addTuple:   (values) ->
      @tuples.add new Tuple {values}

#   * computeMinMax(), sets .min and .max on each Attribute
    computeMinMax: ->
      @attributes.each (attr) =>
        minTuple = @tuples.min (tuple) -> tuple.value attr
        maxTuple = @tuples.max (tuple) -> tuple.value attr
        if minTuple != Infinity
          attr.min = minTuple.value attr
          attr.max = maxTuple.value attr

#   * select(test:f(tuple)->Boolean) -> Relation,
#     performs a relational algebra 'select' operation
    select: (test) ->
      newRelation = new Relation
      newRelation.attributes = @attributes
      newRelation.tuples.add @tuples.filter test
      return newRelation

#   * project: (attributes:Array<Relation.Attribute>) -> Relation,
#     performs a relational algebra 'project' operation
    project: (attributes) ->
      newRelation = new Relation
      newRelation.attributes.add attributes
      newRelation.tuples = @tuples
      return newRelation

#   * renameAttributes: (oldName:String, newName:String) -> Relation, returns a new relation with a single attribute renamed
    renameAttribute: (oldName, newName) ->
      newRelation = new Relation
      @attributes.each (attribute) ->
        if attribute.name == oldName
          newAttr = attribute.rename newName
          newRelation.attributes.add newAttr
        else
          newRelation.attributes.add attribute
      newRelation.tuples = @tuples
      return newRelation

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
#   * `index`: Number
  Attribute = Backbone.Model.extend
    initialize: -> expose @, 'name', 'min', 'max', 'index'
    rename: (newName) ->
      new Attribute
        name: newName
        min: @min
        max: @max
        index: @index

  Relation.Attribute = Attribute
  Relation.Tuple = Tuple
  return Relation
