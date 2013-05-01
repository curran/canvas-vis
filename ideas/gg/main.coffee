# Run unit tests for parser
(require './tests.coffee')()

getFile = require './getFile.coffee'
parse = (require './parser').parse
processSourceStmts = require './processSourceStmts.coffee'
processDataStmts = require './processDataStmts.coffee'
evaluateAlgebra = require './evaluateAlgebra.coffee'
processScaleStmts = require './processScaleStmts.coffee'
processCoordStmts = require './processCoordStmts.coffee'
genRenderFns = require './genRenderFns.coffee'
Mark = require './Mark.coffee'

preprocess = (expr) ->

evaluate = (expr, canvas) ->
  #canvas.width = window.innerWidth
  #canvas.height = window.innerHeight
  ctx = canvas.getContext '2d'

  ast = parse expr
  processSourceStmts ast, (err, vars) ->
    vars = processDataStmts ast, vars
    ast = evaluateAlgebra ast, vars
    ast = processScaleStmts ast
#TODO use coords
    coords = processCoordStmts ast
    renderFns = genRenderFns ast
    for {keys, geometry, aesthetics} in renderFns
      for key in keys
        mark = Mark()
        mark = geometry key, mark
# TODO  mark = coords.apply mark
        mark = aesthetics key, mark
        mark.render ctx, canvas.width, canvas.height

# Evaluate a Grammar of Graphics expression from a file.
#getFile 'gg/scatter.gg', (err, expr) -> evaluate expr, canvas
getFile 'gg/scatter.gg', (err, expr) ->
  expressionBox.value = expr
  expressionBox.addEventListener 'input', evalExpressionBox
  evalExpressionBox()

evalExpressionBox = ->
  try
    errorDiv.innerHTML = ''
    evaluate expressionBox.value, canvas
  catch error
    console.log 'here'
    errorDiv.innerHTML = error
