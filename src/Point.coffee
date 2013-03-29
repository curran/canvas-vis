define ['underscore'], (_) ->
  methods = set: (@x, @y) ->
  create: (x, y) -> _.extend {x, y}, methods
