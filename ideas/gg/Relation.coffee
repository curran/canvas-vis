type = require './type.coffee'
_ = require 'underscore'
map = _.map
first = _.first
rest = _.rest
union = _.union

class Relation
  constructor: (@keys, @attributes) ->
  attribute: (name) -> _.findWhere @attributes, {name}
  n: -> @attributes.length
  m: -> @keys.length
  toCSV: ->
    names = (attr.name for attr in @attributes).join ','
    line = (key) =>
      (attr.map[key] for attr in @attributes).join ','
    tuples = (map @keys, line).join '\n'
    names + '\n' + tuples

class Attribute
  constructor: (@name, @keys, @map) ->
  values: -> @map[key] for key in @keys
Relation.Attribute = Attribute

Relation.fromAttribute = (attr) ->
  new Relation attr.keys, [attr]

Relation.fromTable = (table) ->
  names = first table
  tuples = rest table

  n = names.length
  m = tuples.length

  keys = [0...m]
  
  attributes = for i in [0...n]
    name = names[i]
    keyValueMap = {}
    for key in keys
      tuple = tuples[key]
      keyValueMap[key] = parseFloat tuple[i]
    new Attribute name, keys, keyValueMap

  new Relation keys, attributes

Relation.cross = (a, b) ->
  type a, Relation
  type b, Relation
# assume key set matches between a and b
  keys = a.keys
  attributes = union a.attributes, b.attributes
  new Relation keys, attributes


module.exports = Relation
