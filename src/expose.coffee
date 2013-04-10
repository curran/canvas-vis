# expose
# ======
#
# Exposes properties of Backbone models using JS setters and getters.
define [], ->
  (model, properties...) ->
    if !model then throw Error """
      'model' argument to `expose` is null!'"""
    _.each properties, (p) ->
      #      if !(model.get p) then throw Error """
      #        Missing expected property '#{p}' """
      model.__defineGetter__ p, -> model.get p
      model.__defineSetter__ p, (val) -> model.set p, val
