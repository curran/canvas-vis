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
  dataStmts = []
  variables = match 'type', 'variables',
    'statements': (stmts, relation) ->

      dataStmts = []
      variables stmt for stmt in stmts.statements

      for dataStmt in dataStmts
        a = dataStmt.oldName
        b = dataStmt.newName
        relation = relation.renameAttribute a, b

      attrsToProject = []
      for d in dataStmts
        attr = relation.attrByName d.newName
        attrsToProject.push attr

      return relation.project attrsToProject
    'data': (data) -> dataStmts.push data
    'statement': ->

  return variables
