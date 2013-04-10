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
    copy: (rectangle) ->
      @x = rectangle.x
      @y = rectangle.y
      @w = rectangle.w
      @h = rectangle.h
