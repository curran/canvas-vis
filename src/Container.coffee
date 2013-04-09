define ['cv/Component'], (Component) ->
  Backbone.Model.extend
    initialize: ->
      @children = new Backbone.Collection
      @children.on 'add remove graphicsDirty', =>
        @trigger 'graphicsDirty'
