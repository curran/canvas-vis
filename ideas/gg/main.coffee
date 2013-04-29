tests = require './tests.coffee'
getFile = require './getFile.coffee'
parse = (require './parser').parse
processSourceStmts = require './processSourceStmts.coffee'
processDataStmts = require './processDataStmts.coffee'
processScaleStmts = require './processScaleStmts.coffee'
processCoordStmts = require './processCoordStmts.coffee'
evaluateAlgebra = require './evaluateAlgebra.coffee'
show = require './show.coffee'
match = require './match.coffee'

_ = require 'underscore'
map = _.map
compact = _.compact
first = _.first
argsToOptions = require './argsToOptions.coffee'

# Run unit tests for parser
tests()

# Evaluate the Grammar of Graphics expression
getFile 'gg/scatter.gg', (err, expr) -> evaluate expr, canvas

Mark = ->
  x: (@_x) -> @
  y: (@_y) -> @
  render: (ctx, w, h) ->
    x = @_x * w
    y = @_y * h
    ctx.fillRect x, y, 10, 10

evaluate = (expr, canvas) ->
  ast = parse expr
  processSourceStmts ast, (err, vars) ->
    vars = processDataStmts ast, vars
    ast = evaluateAlgebra ast, vars
    ast = processScaleStmts ast
    #console.log show ast
    coords = processCoordStmts ast
    renderFns = genRenderFns ast
    #console.log renderFns

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx = canvas.getContext '2d'

    for {keys, geometry, aesthetics} in renderFns
      for key in keys
        mark = Mark()
        mark = geometry key, mark
#        mark = coords.apply mark
#        mark = aesthetics key, mark
#        console.log mark._x, mark._y
        mark.render ctx, canvas.width, canvas.height

genRenderFns = (ast) ->
  elementStmts = extractElementStmts ast
  map elementStmts, ({fn}) ->
    options = argsToOptions fn.args
    keys: extractKeys fn
    geometry: genGeometryFn fn.name, options
    aesthetics: genAestheticsFn fn.name, options

extractKeys = match
  Fn: ({name, args}) ->
    first map args, extractKeys
  Relation: (relation) -> relation.keys
  AST: ->

extractElementStmts = match
  Program: ({stmts}) ->
    compact map stmts, extractElementStmts
  Element: (e) -> e
  AST: ->

genGeometryFn = (fnName, options) ->
  (key, mark) ->
    if options.position
      relation = options.position
      mark.x(relation.attributes[0].map[key])
          .y(relation.attributes[1].map[key])

#geometryFns =
#  point: 

genAestheticsFn = (fnName, options) ->
  (key, mark) ->
    mark



genRenderFn = ({fn}) ->
  options = argsToOptions fn.args


  
# match
#  Element: ({fn}) -> genRenderFn fn
#  Fn: ({name, args}) ->
#    new Fn name, map args, genRenderFn
#  Cross: ({left, right, sym}) ->
#    Relation.cross (genRenderFn left), (genRenderFn right)
#  Name: ({value}) -> Relation.fromAttribute vars[value]
#  AST: (ast) -> ast
  
