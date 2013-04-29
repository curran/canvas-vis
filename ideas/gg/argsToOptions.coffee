argsToOptions = (args) ->
  options = {}
  for fn in args
    #    type fn, Fn
    if args.length == 1
      options[fn.name] = fn.args[0].value
    else
      options[fn.name] = (arg.value for arg in fn.args)
  return options

module.exports = argsToOptions
