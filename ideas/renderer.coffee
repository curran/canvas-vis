renderer = match 'type',
  statements: (tree, key, callback) ->
    for stmt in t.statements when stmt.type == 'ELEMENT'
      callback renderer stmt.expr, key
  function: match 'name',
    position: (fn) ->
      tuple = renderer fn.args[0]
      mark()
        .x(tuple[0])
        .y(tuple[1])
  varset: (varset, key) -> varset.value key


# A key goes down the tree
# A mark comes up the tree
