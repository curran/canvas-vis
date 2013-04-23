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

class Scale
  constructor: (values) ->
    @min = _.min values
    @max = _.max values
  normalize: (value) -> (value - @min)/(@max - @min)

t = ->

  class Animal
    constructor: (@name) ->
  class Snake extends Animal
  class Horse extends Animal
  sam = new Snake "Sammy the Python"
  tom = new Horse "Tommy the Palomino"
  sayHello = match
    Snake: (snake) -> "I am #{snake.name}, hiss!"
    Animal: (animal) -> "I am #{animal.name}, an animal."

  e (sayHello sam), 'I am Sammy the Python, hiss!'
  e (sayHello tom), 'I am Tommy the Palomino, an animal.'
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

  scale = new Scale [4, 5, 6, 8]
  e (scale.normalize 7), 0.75

e = (actual, expected) -> if actual != expected
  throw new Error "Expected #{expected}, got #{actual}"


# Hoist into a browser
inNode = typeof module != 'undefined'
if inNode
# Run tests
  GLOBAL._ = require 'underscore'
  t()
  console.log 'All tests passed!'

  express = require 'express'
  app = express()
  port = 8080

  app.use express.static  __dirname
  app.use express.directory  __dirname

  app.listen port
  console.log "Serving at localhost:#{port}"
else
# Run tests
  t()
  console.log 'All tests passed!'

# Draw the Iris Scatterplot

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx = canvas.getContext '2d'

  ctx.fillStyle = 'darkBlue'
  ctx.fillRect 0, 0, canvas.width, canvas.height

  $.get 'iris.csv', (data) ->
    table = $.csv.toArrays data

    columnNames = _.first table
    tuples = _.rest table

    xIndex = 0
    xs = _.map tuples, (tuple) -> tuple[xIndex]
    xScale = new Scale xs

    yIndex = 1
    ys = _.map tuples, (tuple) -> tuple[yIndex]
    yScale = new Scale ys

    rIndex = 1
    rs = _.map tuples, (tuple) -> tuple[rIndex]
    rScale = new Scale rs

    unit = new Rect 0, 0, 1, 1

    margin = 0.1
    src = new Rect -margin,-margin,1+2*margin,1+2*margin
    dest = new Rect 0, 0, canvas.width, canvas.height
    viewport = new Viewport src, dest

    rect = new Rect
    viewport.project unit, rect
    ctx.fillStyle = 'orange'
    ctx.fillRect rect.x, rect.y, rect.w, rect.h

    inPt = new Point
    outPt = new Point
    minRadius = 5
    maxRadius = 10
    points = []

# Primary focus: How can this code be abstracted?
# Identify elements of the pipeline
    for tuple in tuples
      inPt.x = xScale.normalize tuple[xIndex]
      inPt.y = yScale.normalize tuple[yIndex]
      viewport.project inPt, outPt

      r = rScale.normalize tuple[rIndex]
      radius = minRadius + r * (maxRadius - minRadius)

      ctx.fillStyle = 'black'
      ctx.beginPath()
      ctx.arc outPt.x, outPt.y, radius, 0, 2*Math.PI
      ctx.closePath()
      ctx.fill()
