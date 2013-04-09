# `expose` exposes properties of
# Backbone models using JS setters and getters.
define ['underscore'], (_) ->
  (model, properties...) ->
    _.each properties, (p) ->
      model.__defineGetter__ p, -> model.get p
      model.__defineSetter__ p, (val) -> model.set p val
