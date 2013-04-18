#grammarOfGraphics
#=================
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

# printTree(tree) -> String
  printTree = (tree) ->
    p = match 'type', 'printTree',
      statements: (statements, indent) ->
        [ss, i] = [statements.statements, indent]
        line(i+'statements')+
          ((p s, i+'  ') for s in ss).join ''
      statement: (stmt, indent) ->
        [
          (line indent+'statement: '+stmt.statementType),
          (p stmt.expr, indent+'  ')
        ].join ''
      data: (data, indent) ->
        line indent+"statement: DATA #{data.newName} = \"#{data.oldName}\""
      name: (name, indent) ->
        line indent+'name '+name.name
      number: (number, indent) ->
        line indent+'number '+number.value
      string: (string, indent) ->
        line indent+'string '+string.value
      cross: (cross, indent) ->
        [
          (line indent+'cross'),
          (line indent+'  left'),
          (p cross.left, indent+'    '),
          (line indent+'  right'),
          (p cross.right, indent+'    ')
        ].join ''
      assignment: (assignment, indent) ->
        [
          (line indent+'assignment'),
          (line indent+'  left'),
          (p assignment.left, indent+'    '),
          (line indent+'  right'),
          (p assignment.right, indent+'    ')
        ].join ''
      function: (fn, indent) ->
        [
          (line indent+'function '+fn.name),
          (line indent+'  args:'),
          (for arg in fn.args
             p arg, indent+'    '
          ).join ''
        ].join ''
      varset: (varset, indent) -> indent+'<varset>'
    p tree, ''
  line = (str) -> str + '\n'
  {execute, variables, algebra}
