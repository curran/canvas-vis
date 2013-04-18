# Rectangle
# =========
# 
#   * position: Point
#   * size: Dimension
define ['cv/expose'], (expose) ->
  Backbone.Model.extend
#TODO use Point and Dimension
    initialize: ->
      expose @, 'x', 'y', 'w', 'h'
      if !@x then @x = 0
      if !@y then @y = 0
      if !@w then @w = 1
      if !@h then @h = 1
    copy: (rectangle) ->
      @x = rectangle.x
      @y = rectangle.y
      @w = rectangle.w
      @h = rectangle.h
