#grammarOfGraphics
#=================
#
# The top level module exposing Grammar of Graphics functionality.
#
# For inner modules, check out [grammarOfGraphics docs](grammarOfGraphics.html)
define [ 'cv/grammarOfGraphics/parser', 'cv/match', 'cv/Varset']
     , (parser, match, Varset) ->

  execute = (columns, expression) ->
    tree = parser.parse expression
    vars = variables tree, columns
    tree = algebra tree, vars
    #console.log printTree tree

#scales:Map<int tupleIndex, Scale>
    scales = step3 tree
    console.log scales
    return tree

  variables = (tree, columns) ->
    vars = _.extend {}, columns
    for stmt in tree.statements when stmt.type == 'data'
      vars[stmt.newName] = columns[stmt.oldName]
    return vars

  # algebra
  # --------------
  # Replaces graphics algebra expressions with varsets in the syntax tree.
  algebra = match 'type', 'algebra',
    'statements': (stmts, vars) ->
      type: 'statements'
      statements: (algebra stmt, vars for stmt in stmts.statements)
    'data': (data, vars) -> data
    'statement': match 'statementType', 'algebra',
      ELEMENT: (stmt, vars) ->
        type: 'statement'
        statementType: 'ELEMENT'
        expr: algebra stmt.expr, vars
      TRANS: (stmt, vars) -> stmt
      SCALE: (stmt, vars) -> stmt
      COORD: (stmt, vars) -> stmt
      GUIDE: (stmt, vars) -> stmt
    'function': (fn, vars) ->
      type: 'function'
      name: fn.name
      args: (algebra arg, vars for arg in fn.args)
    'cross': (cross, vars) ->
      left = algebra cross.left, vars
      right = algebra cross.right, vars
      Varset.cross left, right
      #return cross
    'name': (name, vars) ->
      # TODO have variables generate Varsets rather than Variables
      Varset.fromVariable vars[name.name]
      #return name
  step3 = match 'type', 'step3',
    'statements': (stmts) ->
      scales = (step3 stmt for stmt in stmts.statements)
      _.extend.apply null, scales
#TODO unify 'data' as a 'statement'
    'data': (data) -> {}
    'statement': match 'statementType', 'step3.statement',
      ELEMENT: (stmt) -> {}
      TRANS: (stmt) -> {}
      SCALE: (stmt) -> step3 stmt.expr
      COORD: (stmt) -> {}
      GUIDE: (stmt) -> {}
    'function': match 'name', 'step3.function',
      'linear': (fn) ->
        if fn.args.length != 1
          throw Error 'linear() expects one argument'
        dim = step3 fn.args[0]
        result = {}
        result[dim] = type: 'linear'
        result
      'dim': (fn) ->
        if fn.args.length != 1
          throw Error 'dim() expects one argument'
        if fn.args[0].type != 'number'
          throw Error 'dim() expects a numeric argument'
        fn.args[0].value

  show = match 'type', 'show',
    statements: (t) -> (show s for s in t.statements).join '\n'
    statement: (t) -> "#{t.statementType}: #{show t.expr}"
    data: (t) -> "DATA: #{t.newName}=\"#{t.oldName}\""
    name: (t) -> t.name
    number: (t) -> t.value
    string: (t) -> t.value
    cross: (t) -> "#{show t.left}*#{show t.right}"
    assignment: (t) -> "#{show t.left}=#{show t.right}"
    function: (t) -> "#{t.name}(#{(show a for a in t.args).join ','})"
    varset: (t) -> '<varset>'

  {execute, variables, algebra, show}
