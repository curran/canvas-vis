checkTypeOf = (obj, typeStr) ->
  if typeof obj != typeStr
    throw Error """
      Type Error: expected type '#{typeStr}',
        got type #{typeof obj}
    """
module.exports = (obj, t) ->
  if obj == undefined
    throw Error 'First argument to type() is null'
  if t == undefined
    throw Error 'Second argument to type() is null'
  if t == Number
    checkTypeOf obj, 'number'
  else if t == String
    checkTypeOf obj, 'string'
  else if obj.constructor != t
    constr = obj.constructor
    shouldError = constr != t
    while shouldError and constr?.__super__
      constr = constr.__super__.constructor
      shouldError = (constr != t)
    if shouldError
      throw Error """
        Type Error: expected type '#{t.name}',
        got type #{constr.name}
      """
