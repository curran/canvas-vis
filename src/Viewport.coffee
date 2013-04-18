# Viewport
# ========
# 
#   * src: Rectangle
#   * dest: Rectangle
define ['cv/expose', 'cv/Rectangle'], (expose, Rectangle) ->
  Viewport = Backbone.Model.extend
    initialize: ->
      expose @, 'src', 'dest'
      if !@src then @src = new Rectangle
      if !@dest then @dest = new Rectangle
    srcToDest: (inPt, outPt) ->
      s = @src; d = @dest
      outPt.x = (inPt.x - s.x) / s.w * d.w + d.x
      outPt.y = (inPt.y - s.y) / s.h * d.h + d.y
    destToSrc: (inPt, outPt) ->
      s = @src; d = @dest
      outPt.x = (inPt.x - d.x) / d.w * s.w + s.x
      outPt.y = (inPt.y - d.y) / d.h * s.h + s.y
    srcToDestRect: (inRect, outRect) ->
      s = @src; d = @dest
      outRect.x = (inRect.x - s.x) / s.w * d.w + d.x
      outRect.y = (inRect.y - s.y) / s.h * d.h + d.y
      outRect.w = inRect.w * d.w / s.w
      outRect.h = inRect.h * d.h / s.h
