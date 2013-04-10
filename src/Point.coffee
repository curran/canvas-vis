# Point
# =====
# 
#   * x: Number = 0
#   * y: Number = 0
define ['cv/expose'], (expose) ->
  Backbone.Model.extend
    initialize: -> expose @, 'x', 'y'
    setXY: (@x, @y) ->
