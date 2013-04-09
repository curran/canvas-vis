# `Viewport`
# 
#   * `src`: Rectangle
#   * `dest`: Rectangle
define ['cv/expose'], (expose) ->
  Viewport = Backbone.Model.extend
    initialize: -> expose @, 'src', 'dest'
    srcToDest: (inPt, outPt) ->
      s = @src; d = @dest
      outPt.x = (inPt.x - s.x) / s.w * d.w + d.x
      outPt.y = (inPt.y - s.y) / s.h * d.h + d.y
    destToSrc: (inPt, outPt) ->
      s = @src; d = @dest
      outPt.x = (inPt.x - d.x) / d.w * s.w + s.x
      outPt.y = (inPt.y - d.y) / d.h * s.h + s.y
