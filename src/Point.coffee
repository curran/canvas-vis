# Point
# =====
# 
#   * x: Number = 0
#   * y: Number = 0
define ['cv/expose'], (expose) ->
  Backbone.Model.extend
    initialize: ->
      expose @, 'x', 'y'
      _.defaults @, {x:0, y:0}
    setXY: (@x, @y) ->
