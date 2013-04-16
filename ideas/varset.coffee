
class Variable
  constructor: ->
    @_keysToValues = {}
  addEntry: (key, value) -> @_keysToValues[key] = value
  keys: -> _.keys @_keysToValues
  values: -> _.values @_keysToValues

class Varset
  constructor: ->
    @_orderedKeys = []
    @_keysToTuples = {}
  insert: (key, tuple) ->
    @_orderedKeys.push key
    @_keysToTuples[key] = tuple
  keys: -> @_orderedKeys
  tuple: (key) -> @_keysToTuples[key]

varsetIterator = (varset) ->
  i = 0
  n = keys.length
  keys = varset.keys()
  key = keys[i]
  
  hasNext: -> i < n
  next: -> key = keys[i++]
  key: -> key
  tuple: -> varset.tuple key

# varsetForEach(Varset, callback(tuple, key) -> ) ->
varsetForEach = (varset, callback) ->
  it = varsetIterator varset
  while it.hasNext()
    callback it.tuple(), it.key()

varsetBatchIterator = (varset, batchTime, callback) ->
  ->
    it = varsetIterator varset
    startTime = Date.now()
    while it.hasNext()
      callback it.tuple(), it.key()
      endTime = Date.now()
      if endTime - startTime > batchTime
        return false
    return true

greenThreadVarsetForEach = (varset, callback) ->
  batchIt = varsetBatchIterator varset, 2, callback
  cancelled = false
  execBatch = ->
    if (!batchIt() && !cancelled)
      setTimeout execBatch, 0
  cancel: -> cancelled = true

job = greenThreadVarsetForEach myVarset, (tuple, key) ->
  x = tuple[0]
  y = tuple[1]
  drawCircle x, y

addEventListener 'keyPress', (key) ->
  if key == ESC
    job.cancel
