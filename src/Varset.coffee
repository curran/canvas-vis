define [], ->
  class Varset
    constructor: ->
      @_orderedKeys = []
      @_orderedTuples = []
      @_keysToTuples = {}
    insert: (key, tuple) ->
      @_orderedKeys.push key
      @_orderedTuples.push tuple
      @_keysToTuples[key] = tuple
    keys: -> @_orderedKeys
    tuples: -> @_orderedTuples
    tuple: (key) -> @_keysToTuples[key]
    type: 'varset' #for use in AST
#    iterator: ->
#      i = 0
#      n = keys.length
#      keys = varset.keys()
#      key = keys[i]
#      
#      hasNext: -> i < n
#      next: -> key = keys[i++]
#      key: -> key
#      tuple: -> varset.tuple key

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
