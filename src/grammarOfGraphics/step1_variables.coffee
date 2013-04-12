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
  variables = match 'type', 'variables',
    'statements': (statements, relation) ->
      nameReplacements = []
      for stmt in statements.statements
        if stmt.statementType == 'DATA'
          nameReplacements.push nameReplacement stmt.expr

      attrs = []
      for [oldName, newName] in nameReplacements
        [relation, attr] =
          relation.renameAttribute oldName, newName
        attrs.push attr

      return relation.project attrs

  nameReplacement = (expr) ->
    if expr.type == 'assignment'
      if expr.left.type == 'name'
        newName = expr.left.name
        if expr.right.type == 'string'
          oldName = expr.right.value
          [oldName, newName]

  return variables
