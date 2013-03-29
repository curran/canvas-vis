define [], ->
  proto = Object.create null,
    x1:
      get: -> @x
      set: (@x) ->
    x2:
      get: -> @x + @w
      set: (x2) -> @w = x2 - @x
    y1:
      get: -> @y
      set: (@y) ->
    y2:
      get: -> @y + @h
      set: (y2) -> @w = y2 - @y
    centerX:
      get: -> @x + @w / 2
    centerY:
      get: -> @y + @h / 2
    set: value: (x, y, w, h) ->
      @x = x; @y = y; @w = w; @h = h
  create: (x, y, w, h) ->
    Object.create proto,
      x: value: x, writable:true
      y: value: y, writable:true
      w: value: w, writable:true
      h: value: h, writable:true
