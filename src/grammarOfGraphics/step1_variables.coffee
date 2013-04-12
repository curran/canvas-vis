# step 1: variables
# =========
#
# The first step in Wilkinson's Grammar of Graphics pipeline.
#
# Evaluates all 'DATA' statements to extract named variables from the input relation.
#
# Here, Wilkinson's notion of a varset is represented using the Relation module.
#
# variables(tree) -> Relation
define ['cv/match'], (match) ->
  match 'type', 'variables',
    'statements': (statements, relation) ->
      for statement in statements.statements
        if statement.statementType == 'DATA'
          console.log 'here'
    'statement': (stmt, indent) ->
      line indent+'statement: '+stmt.statementType
      p stmt.expr, indent+'  '
