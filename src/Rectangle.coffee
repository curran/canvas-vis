# `Rectangle`
# 
#   * `position`: Point
#   * `size`: Dimension
define ['backbone', 'underscore'], (Backbone, _) ->
  expose = (model, properties...) ->
    _.each properties, (property) ->
      p = property
      model.__defineGetter__ p, -> model.get p
      model.__defineSetter__ p, (val) -> model.set p val
  Backbone.Model.extend
    initialize: ->
      expose @, 'x', 'y', 'w', 'h'
