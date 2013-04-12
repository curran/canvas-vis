# printTree(tree)
# ===============
# Prints the tree structure to the console using indentation.
define ['cv/match'], (match) ->
  byType = (fnName, fns) ->
    match 'type', fns, fnName
  line = (str) -> str + '\n'
  printTree = (tree) ->
    p = byType 'printTree',
      'statements': (statements, indent) ->
        [ss, i] = [statements.statements, indent]
        line(i+'statements')+
          ((p s, i+'  ') for s in ss).join ''
      'statement': (stmt, indent) ->
        line indent+'statement: '+stmt.statementType
        p stmt.expr, indent+'  '
      'name': (name, indent) ->
        line indent+'name '+name.name
      'number': (number, indent) ->
        line indent+'number '+number.value
      'string': (string, indent) ->
        line indent+'string '+string.value
      'cross': (cross, indent) ->
        [
          (line indent+'cross'),
          (line indent+'  left'),
          (p cross.left, indent+'    '),
          (line indent+'  right'),
          (p cross.right, indent+'    '),
        ].join ''
      'assignment': (assignment, indent) ->
        [
          (line indent+'assignment'),
          (line indent+'  left'),
          (p assignment.left, indent+'    '),
          (line indent+'  right'),
          (p assignment.right, indent+'    '),
        ].join ''
      'function': (fn, indent) ->
        [
          (line indent+'function '+fn.name),
          (line indent+'  args:'),
          (for arg in fn.args
             p arg, indent+'    '
          ).join ''
        ].join ''
    p tree, ''
