_ = require 'underscore'
class Relation
  constructor: (table) ->
    names = _.first table
    tuples = _.rest table

    n = names.length
    m = tuples.length

    # TODO use metadata to determine if
    # a column should be used as keys.
    # For now integer keys are generated.
    @keys = [0...m]
    
    @attributes = for i in [0...n]
      name = names[i]
      map = {}
      for key in @keys
        tuple = tuples[key]
        map[key] = parseFloat tuple[i]
      new Attribute name, @keys, map
  attribute: (name) -> _.findWhere @attributes, {name}

class Attribute
  constructor: (@name, @keys, @map) ->
  values: -> @map[key] for key in @keys

Relation.Attribute = Attribute
module.exports = Relation
