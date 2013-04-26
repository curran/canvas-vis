#checkTypeOf = (obj, typeStr) ->
#  if typeof obj != typeStr
#    throw Error """
#      Type Error: expected (typeof) '#{typeStr}',
#        got type #{typeof obj}
#    """
#module.exports = (obj, t) ->
#  if obj == undefined
#    throw Error 'First argument to type() is null'
#  if t == undefined
#    throw Error 'Second argument to type() is null'
#  if t == Number
#    checkTypeOf obj, 'number'
#  else if t == String
#    checkTypeOf obj, 'string'
#  else if obj.constructor != t
#    constr = obj.constructor
#    shouldError = constr != t
#    while shouldError and constr?.__super__
#      constr = constr.__super__.constructor
#      shouldError = (constr != t)
#    if shouldError
#      throw Error """
#        Type Error: expected type '#{t.name}',
#        got type #{constr.name}
#      """
#
#checkTypeOf = (obj, typeStr) ->
#  if typeof obj != typeStr
#    throw Error """
#      Type Error: expected (typeof) '#{typeStr}',
#        got type #{typeof obj}
#    """
type = (object, expectedType) ->
  error = false
  if expectedType == Number
    error = (typeof object != 'number')
  else if expectedType == String
    error = (typeof object != 'string')
  else
    c = object.constructor
    error = (c != expectedType)
    # Walk up the class hierarchy
    while error and c?.__super__
      c = c.__super__.constructor
      error = (c != expectedType)
  if error
    throw Error 'Type Error'

module.exports = type

  #    constr = obj.constructor
  #    shouldError = constr != t
  #    while shouldError and constr?.__super__
  #      constr = constr.__super__.constructor
  #      shouldError = (constr != t)
