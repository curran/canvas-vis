# `Point`
# 
#   * `x`: Number
#   * `y`: Number
define ['backbone', 'underscore', 'cv/expose'], (Backbone, _, expose) ->
  Backbone.Model.extend
    initialize: ->
      expose @, 'x', 'y'
      _.defaults @, {x:0, y:0}
    setXY: (@x, @y) ->
