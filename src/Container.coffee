define ['cv/Component', 'underscore', 'backbone']
     , (Component, _, Backbone) ->
  create: (options) ->
    container = Component.create options 
    _.extend container, new Backbone.Collection
    container.on 'add', () ->
      container.trigger 'graphicsDirty'
    return container
