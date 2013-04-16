define [], ->
  Variable = (@name) ->
    @map = {}
  Variable.prototype =
    addValue: (key, value) -> @map[key] = value
    keys: -> _.keys @map
    value: (key) -> @map[key]

  Variable.cross = (variables) ->
    rel = new Relation
    for variable in variables
      rel.addAttribute variable.name
    for key in variables[0].keys()
      tuple = []
      for variable in variables
        tuple.push variable.value key
      rel.addTuple tuple
    return rel
