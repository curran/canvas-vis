module.exports = (fns) ->
  (obj) ->
    if !obj
      throw Error "attempting to match type of an undefined object"
    constructor = obj.constructor
    fn = fns[constructor.name]
    while !fn and constructor.__super__
      constructor = constructor.__super__.constructor
      fn = fns[constructor.name]
    if fn
      fn.apply @, arguments
    else
      throw Error "no match for type #{constructor.name}."
