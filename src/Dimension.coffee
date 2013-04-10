# Dimension
# =========
# 
#   * w: Number
#   * h: Number
define ['cv/expose'], (expose) ->
  Backbone.Model.extend
    initialize: -> expose @, 'w', 'h'
    setWH: (@w, @h) ->
