# Step 3: Scales
# ==============
#
# The third step in Wilkinson's Grammar of Graphics pipeline.
#
# Evaluates all SCALE statements.
define ['cv/match', 'cv/grammarOfGraphics/printTree', 'cv/Varset']
     , (match, printTree, Varset) ->
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
          
