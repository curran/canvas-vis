type = (obj, t) ->
  if obj == undefined
    throw Error 'First argument to type() is null'
  if t == undefined
    throw Error 'Second argument to type() is null'
  shouldError = switch t
    when Number then typeof obj != 'number'
    when String then typeof obj != 'string'
    else obj.constructor != t
  if shouldError then throw Error 'Type Error'

match = (fns) ->
  (obj) ->
    constructor = obj.constructor
    fn = fns[constructor.name]
    while !fn and constructor.__super__
      constructor = constructor.__super__.constructor
      fn = fns[constructor.name]
    if fn
      fn.apply @, arguments
    else
      throw Error "no match for type #{constructor.name}."

class Point
  constructor: (@x = 0, @y = 0) ->
    type @x, Number
    type @y, Number

class Rect
  constructor: (@x=0, @y=0, @w=1, @h=1) ->
    type @x, Number
    type @y, Number
    type @w, Number
    type @h, Number

class Viewport
  constructor: (@src=new Rect, @dest=new Rect) ->
    type @src, Rect
    type @dest, Rect
  project: match
    Point: (inPt, outPt) ->
      type inPt, Point
      type outPt, Point
      s = @src; d = @dest
      outPt.x = (inPt.x - s.x) / s.w * d.w + d.x
      outPt.y = (inPt.y - s.y) / s.h * d.h + d.y
    Rect: (inRect, outRect) ->
      type inRect, Rect
      type outRect, Rect
      s = @src; d = @dest
      outRect.x = (inRect.x - s.x) / s.w * d.w + d.x
      outRect.y = (inRect.y - s.y) / s.h * d.h + d.y
      outRect.w = inRect.w * d.w / s.w
      outRect.h = inRect.h * d.h / s.h

t = ->
  e (new Point 4, 6).x, 4
  e (new Rect 5, 6, 7, 8).w, 7

  src = new Rect 0, 0, 1, 1
  dest = new Rect 2, 4, 6, 8
  viewport = new Viewport src, dest
  inPt = new Point 0.5, 0.75
  outPt = new Point
  viewport.project inPt, outPt
  e outPt.x, 5
  e outPt.y, 10

e = (a, b) -> if a != b
  throw new Error "Expected #{a}, got #{b}"

# Run tests
t()
console.log 'All tests passed!'

# Hoist into a browser
inNode = typeof module != 'undefined'
if inNode
  express = require 'express'
  app = express()
  port = 8080

  app.use express.static  __dirname
  app.use express.directory  __dirname

  app.listen port
  console.log "Serving at localhost:#{port}"
else
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx = canvas.getContext '2d'
  ctx.fillRect 0, 0, canvas.width, canvas.height
