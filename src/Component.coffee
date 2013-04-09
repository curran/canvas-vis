# A `Component` renders to a Canvas, and responds to events.
#
#   * `paint`: (ctx, bounds:`Rectangle`) ->
define ['cv/expose'], (expose) ->
  Backbone.Model.extend
    initialize: -> expose @, 'paint'
