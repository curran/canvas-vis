# step 1: variables
# =========
#
# The first step in Wilkinson's Grammar of Graphics pipeline.
#
# Evaluates all 'DATA' statements to extract named variables from the input relation.
#
# Here, Wilkinson's notion of a varset is represented using the Relation module.
#
# variables(tree, relation) -> Relation
define ['cv/match', 'cv/grammarOfGraphics/printTree']
     , (match, printTree) ->
  match 'type', 'variables',
    'statements': (statements, relation) ->
      stmts = statements.statements
      dataStmts = _.filter stmts, (stmt) ->
        stmt.statementType == 'DATA'
      for dataStmt in dataStmts
        console.log printTree dataStmt.expr
      relation
