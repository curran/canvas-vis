# Point
# =====
# 
#   * x: Number
#   * y: Number
define ['cv/expose'], (expose) ->
  Backbone.Model.extend
    initialize: -> expose @, 'x', 'y'
    setXY: (@x, @y) ->
