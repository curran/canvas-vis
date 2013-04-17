define [], ->
  class Variable
    constructor: ->
      @_keysToValues = {}
    addEntry: (key, value) ->
      @_keysToValues[key] = value
    keys: -> _.keys @_keysToValues
    values: -> _.values @_keysToValues
    value: (key) -> @_keysToValues[key]
