require ['cv/grammarOfGraphics/parser'], (parser) ->
  
  # This utility lets us approximate Haskell's 
  # pattern matching syntax in CoffeeScript
  match = (property, fns, fnName = 'obj') ->
    (obj) ->
      key = obj[property]
      fn = fns[key]
      if fn
        fn.apply null, arguments
      else
        throw Error """
          no match for #{fnName}.#{property} = #{key}
        """

  byType = (fnName, fns) ->
    match 'type', fns, fnName

  testInput = """
    DATA: response = response
    DATA: gender = Gender
    SCALE: cat(dim(1), values("Rarely", "Infrequently"))
    SCALE: cat(dim(2), values("Female", "Male"))
    COORD: rect(dim(2),polar.theta(dim(1)))
    ELEMENT: interval.stack(position(summary.proportion(response * gender)), label(response), color(response))
  """

  # Prints the tree structure using indentation.
  printTree = (tree) ->
    helper = byType 'printTree',
      'statements': (statements, indent) ->
        console.log indent + 'statements'
        indent += '  '
        _.each statements.statements, (statement) ->
          helper statement, indent
      'statement': (stmt, indent) ->
        console.log indent+'statement: '+stmt.statementType
        indent += '  '
        helper stmt.expr, indent
      'name': (name, indent) ->
        console.log indent+'name '+name.name
      'number': (number, indent) ->
        console.log indent+'number '+number.value
      'string': (string, indent) ->
        console.log indent+'string '+string.value
      'cross': (cross, indent) ->
        console.log indent+'cross'
        indent += '  '
        console.log indent+'left'
        helper cross.left, indent+'  '
        console.log indent+'right'
        helper cross.right, indent+'  '
      'assignment': (assignment, indent) ->
        console.log indent+'cross'
        indent += '  '
        console.log indent+'left'
        helper assignment.left, indent
        console.log indent+'right'
        helper assignment.right, indent
      'function': (fn, indent) ->
        console.log indent+'function '+fn.name
        indent += '  '
        console.log indent+'args:'
        indent += '  '
        _.each fn.args, (arg) ->
          helper arg, indent
    helper tree, ''

  printTree parser.parse testInput
