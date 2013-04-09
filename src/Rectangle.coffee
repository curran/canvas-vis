# `Rectangle`
# 
#   * `position`: Point
#   * `size`: Dimension
define ['backbone', 'cv/expose'], (Backbone, expose) ->
  Backbone.Model.extend
    initialize: ->
      expose @, 'x', 'y', 'w', 'h'
