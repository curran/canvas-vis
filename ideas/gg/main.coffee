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
Scale = require './Scale.coffee'
Interval = require './Interval.coffee'

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
  size: (@_size) -> @
  render: (ctx, w, h) ->
    x = @_x * w
    y = @_y * h
    radius = @_size * (w + h) / 4
    ctx.beginPath()
    ctx.arc x, y, radius, 0, 2*Math.PI
    ctx.closePath()
    ctx.fill()

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
        mark = aesthetics key, mark
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
  geometryFns[fnName] options

geometryFns =
  point: (options) ->
    if options.position
      relation = options.position
      (key, mark) ->
        mark.x(relation.attributes[0].map[key])
            .y(relation.attributes[1].map[key])
    else (key, mark) -> mark

genAestheticsFn = (fnName, options) ->
  aestheticsFns[fnName] options


aestheticsFns =
  point: ({size}) ->
    if size
      minSize = 0.01
      maxSize = 0.05
      unit = new Interval 0, 1
      sizes = new Interval minSize, maxSize
      scale = new Scale
#      scale.dest.min = 0.1
#      scale.dest.max = 0.1
      attr = size.attributes[0]
      attr = scale.apply attr
      (key, mark) ->
        val = attr.map[key]
        mark.size unit.to sizes, val
    else (key, mark) -> mark

