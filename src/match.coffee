# Match
# =====
# This utility lets us approximate Haskell's 
# pattern matching syntax in CoffeeScript
define [], ->
  # TODO remove fnName, because it makes the code cleaner and has no effect on debugging (stack trace tells all)
  match = (property, fnName, fns) ->
    (obj) ->
      key = obj[property]
      fn = fns[key]
      if fn
        fn.apply null, arguments
      else
        throw Error """
          no match for #{fnName}.#{property} = #{key}.
          Object = #{obj}
        """
