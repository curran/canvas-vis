# Step 1: Variables
# =========
#
# The first step in Wilkinson's Grammar of Graphics pipeline.
#
# Evaluates all 'DATA' statements to extract named variables from the input relation.
define ['cv/match', 'cv/grammarOfGraphics/printTree']
     , (match, printTree) ->
  dataStmts = []
  step1 = match 'type', 'step1',
    'statements': (stmts, variables) ->

      dataStmts = []
      step1 stmt for stmt in stmts.statements

      for dataStmt in dataStmts
        oldName = dataStmt.oldName
        newName = dataStmt.newName

        variables[newName] = variables[oldName]

      return variables
    'data': (data) -> dataStmts.push data
    'statement': ->
