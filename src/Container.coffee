# Container
# =========
#
#   * children: Collection<Component>
define ['cv/Component'], (Component) ->
  Component.extend
    initialize: ->
      @children = new Backbone.Collection
      @children.on 'add remove graphicsDirty', =>
        @trigger 'graphicsDirty'
