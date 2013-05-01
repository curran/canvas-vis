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

evaluate = (expr, canvas, callback) ->
  #canvas.width = window.innerWidth
  #canvas.height = window.innerHeight
  ctx = canvas.getContext '2d'
  ctx.clearRect 0, 0, canvas.width, canvas.height

  ast = parse expr
  processSourceStmts ast, (err, vars) ->
    if err then return callback err
    vars = processDataStmts ast, vars
# TODO fix this callback hack by
# 1. Make the pipeline pass only the AST
# 2. Refactor to use async.waterfall or async.compose
    ast = evaluateAlgebra ast, vars, callback
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
    evaluate expressionBox.value, canvas, (err) ->
      console.log 'got callback error'
      errorDiv.innerHTML = error

  catch error
    console.log 'got thrown error'
    errorDiv.innerHTML = error
