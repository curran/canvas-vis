tests = require './tests.coffee'
getFile = require './getFile.coffee'
parse = (require './parser').parse
processSourceStmts = require './processSourceStmts.coffee'
processDataStmts = require './processDataStmts.coffee'
processScaleStmts = require './processScaleStmts.coffee'
evaluateAlgebra = require './evaluateAlgebra.coffee'
show = require './show.coffee'
match = require './match.coffee'

# Run unit tests for parser
tests()

# Evaluate the Grammar of Graphics expression
getFile 'gg/scatter.gg', (err, expr) -> evaluate expr, canvas

evaluate = (expr, canvas) ->
  ast = parse expr
  processSourceStmts ast, (err, vars) ->
    vars = processDataStmts ast, vars
    ast = evaluateAlgebra ast, vars
    ast = processScaleStmts ast
    console.log show ast
    #coordinates = processCoordStmts ast
    #console.log coordinates
#    renderFns = genRenderFns ast
#    keys = extractKeys ast
#    for genMark in renderFns
#      for key in keys
#        mark = geometry key
#        mark = coordinates mark
#        mark = aesthetics key
#        console.log mark

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx = canvas.getContext '2d'
    ctx.fillRect 0, 0, canvas.width, canvas.height

#genRenderFns = (ast) ->
#  elementStmts = extractElementStmts ast
#  map elementStmts, genRenderFn

#extractElementStmts = match
#  Program: ({stmts}) ->
#    compact map stmts, extractElementStmts
#  Element: (e) -> e
#  AST: ->

    #genRenderFn = match
    #  Element: ({fn}) -> genRenderFn fn
    #  Fn: ({name, args}) -> 
    #    new Fn name, map args, genRenderFn
    #  Cross: ({left, right, sym}) ->
    #    Relation.cross (genRenderFn left), (genRenderFn right)
    #  Name: ({value}) -> Relation.fromAttribute vars[value]
    #  AST: (ast) -> ast
    #  
