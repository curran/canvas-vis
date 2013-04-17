# Step 2: Algebra
# =========
#
# The second step in Wilkinson's Grammar of Graphics pipeline.
#
# Evaluates all variables and expressions involving cross, nest, or blend.
define ['cv/match', 'cv/grammarOfGraphics/printTree', 'cv/Varset']
     , (match, printTree, Varset) ->
  step2 = match 'type', 'step2',
    'statements': (stmts, vars) ->
      type: 'statements'
      statements: (step2 stmt, vars for stmt in stmts.statements)
    'data': (data, vars) -> data
    'statement': match 'statementType', 'step2',
      ELEMENT: (stmt, vars) ->
        type: 'statement'
        statementType: 'ELEMENT'
        expr: step2 stmt.expr, vars
      TRANS: (stmt, vars) -> stmt
      SCALE: (stmt, vars) -> stmt
      COORD: (stmt, vars) -> stmt
      GUIDE: (stmt, vars) -> stmt
    'function': (fn, vars) ->
      type: 'function'
      name: fn.name
      args: (step2 arg, vars for arg in fn.args)
    'cross': (cross, vars) ->
      left = step2 cross.left, vars
      right = step2 cross.right, vars
      Varset.cross left, right
      #return cross
    'name': (name, vars) ->
      # TODO have step1 generate Varsets rather than Variables
      Varset.fromVariable vars[name.name]
      #return name
