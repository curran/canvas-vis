# Step 2: Algebra
# =========
#
# The second step in Wilkinson's Grammar of Graphics pipeline.
#
# Evaluates all variables and expressions involving cross, nest, or blend.
define ['cv/match', 'cv/grammarOfGraphics/printTree']
     , (match, printTree) ->
  step2 = match 'type', 'step2',
    'statements': (stmts, variables) ->
      (step2 stmt, variables for stmt in stmts.statements)
    'data': (data) -> data
    'statement': (stmt) -> stmt
