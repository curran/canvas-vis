# `Rectangle`
# 
#   * `position`: Point
#   * `size`: Dimension
define ['cv/expose'], (expose) ->
  Backbone.Model.extend
    initialize: ->
      expose @, 'x', 'y', 'w', 'h'
