# Component
# =========
#
# Renders to a Canvas, responds to events.
#
#   * paint: (ctx, bounds:Rectangle) ->
define ['cv/expose'], (expose) ->
  Backbone.Model.extend
    initialize: -> expose @, 'paint'
