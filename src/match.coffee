# Match
# =====
# This utility lets us approximate Haskell's 
# pattern matching syntax in CoffeeScript
define [], ->
  match = (property, fnName, fns) ->
    (obj) ->
      key = obj[property]
      fn = fns[key]
      if fn
        fn.apply null, arguments
      else
        throw Error """
          no match for #{fnName}.#{property} = #{key}
        """
