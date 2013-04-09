define ['cv/Component'], (Component) ->
  create: (options) ->
    container = new Component options
    _.extend container, new Backbone.Collection
    container.on 'add', () ->
      container.trigger 'graphicsDirty'
    return container
