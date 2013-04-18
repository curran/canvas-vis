#grammarOfGraphics
#=================
#
# The module exposing Grammar of Graphics functionality.
define [ 'cv/grammarOfGraphics/parser', 'cv/match', 'cv/Varset', 'cv/Scale']
     , (parser, match, Varset, Scale) ->
  varsets = []

  execute = (columns, expression) ->
    tree = parser.parse expression
    vars = variables tree, columns

    tree = algebra tree, vars
    varsets = extractVarsets tree
    console.log varsets
    #tree = algebra tree, vars
#`scales`:Map<dim, Scale>
    scales = extractScales tree
    
    renderKey = renderer tree
#    console.log scales
    return tree

  # variables
  # ---------
  # Extracts named variables from DATA expressions
  variables = (tree, columns) ->
    vars = _.extend {}, columns
    for stmt in tree.statements when stmt.type == 'data'
      vars[stmt.newName] = columns[stmt.oldName]
    return vars

  # algebra
  # -------
  # Replaces graphics algebra expressions with varsets in the syntax tree.
  algebra = match 'type',
    'statements': (stmts, vars) ->
      type: 'statements'
      statements: (algebra stmt, vars for stmt in stmts.statements)
    'data': (data, vars) -> data
    'statement': match 'statementType',
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
    'name': (name, vars) ->
      Varset.fromVariable vars[name.name]

  # extractVarsets
  # --------------
  # Extracts varsets from the syntax tree into a flat list.
  extractVarsets = match 'type',
    'statements': (stmts) ->
      varsets = (extractVarsets stmt for stmt in stmts.statements)
      _.filter (_.flatten varsets), _.identity
    'data': (data) ->
    'statement': match 'statementType',
      ELEMENT: (stmt) -> extractVarsets stmt.expr
      TRANS: (stmt) ->
      SCALE: (stmt) ->
      COORD: (stmt) ->
      GUIDE: (stmt) ->
    'function': (fn) ->
      (extractVarsets arg for arg in fn.args)
    'name': (name) ->
    'varset': (varset) -> varset

  # extractScales
  # ------
  # Extracts scales from SCALE statements
  extractScales = match 'type',
    'statements': (stmts) ->
      _.filter (extractScales stmt for stmt in stmts.statements), _.identity
    'data': (t) ->
    'statement': (t) ->
      if t.statementType == 'SCALE'
        extractScales t.expr
    'function': match 'name',
      'linear': (fn) ->
        dim = fn.args[0].args[0].value
        console.log 'dim = '+dim
        new Scale dim

  # renderer
  # --------
  # Generates a function that generates a mark from a key.
  renderer = match 'type',

    'statements': (stmts) ->
      renderers = (renderer stmt for stmt in stmts.statements)
      renderers = _.filter renderers, _.identity # remove null elements
      #TODO support multiple ELEMENT statements
      renderers[0]

    'statement': (t) -> if t.statementType == 'ELEMENT' then renderer t.expr
#TODO unify 'data' and 'statement' types
    'data': (t) ->
    'function': match 'name',
      'point': (fn) ->
        argFns = renderer arg for arg in fn.args
        (key) ->
          # set up the mark with defaults
          m = mark()
            .shape('circle')
            .size(0.05)

          # allow arguments to 'point' to
          # set properties of the mark
          for argFn in argFns
            m = argFn key, m

          return m

      'position': (fn, m) ->
        (key, m)->
          varset = fn.args[0]
          tuple = varset.tuple key
          m.x(tuple[0]).y(tuple[1])

  # show
  # ----
  # Renders an abstract syntax tree as an expression string
  show = match 'type',
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

  {execute, variables, algebra, extractScales, show}
