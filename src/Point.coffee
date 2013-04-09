# `Point`
# 
#   * `x`: Number
#   * `y`: Number
define ['cv/expose'], (expose) ->
  Backbone.Model.extend
    initialize: ->
      expose @, 'x', 'y'
      _.defaults @, {x:0, y:0}
    setXY: (@x, @y) ->
