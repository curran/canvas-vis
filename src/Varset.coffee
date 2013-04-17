define [], ->
  class Varset
    constructor: ->
      @_orderedKeys = []
      @_keysToTuples = {}
    insert: (key, tuple) ->
      @_orderedKeys.push key
      @_keysToTuples[key] = tuple
    keys: -> @_orderedKeys
    tuple: (key) -> @_keysToTuples[key]
    type: 'varset' #for use in AST

  Varset.fromVariable = (variable) ->
    result = new Varset
    for key in variable.keys()
      tuple = [variable.value key]
      result.insert key, tuple
    return result

  # cross(Varset a, Varset b)
  #TODO handle missing data
  Varset.cross = (a, b) ->
    result = new Varset
    keys = _.union a.keys(), b.keys()
    for key in keys
      tuple = (a.tuple key).concat (b.tuple key)
      result.insert key, tuple
    return result

  return Varset
