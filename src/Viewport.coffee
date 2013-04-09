define ['backbone'], (Backbone) ->
  Viewport = Backbone.Model.extend
    srcToDest: (inPt, outPt) ->
      outPt.x = (inPt.x - (@get 'src').x) / (@get 'src').w * (@get 'dest').w + (@get 'dest').x
      outPt.y = (inPt.y - (@get 'src').y) / (@get 'src').h * (@get 'dest').h + (@get 'dest').y
    destToSrc: (inPt, outPt) ->
      outPt.x = (inPt.x - (@get 'dest').x) / (@get 'dest').w * (@get 'src').w + (@get 'src').x
      outPt.y = (inPt.y - (@get 'dest').y) / (@get 'dest').h * (@get 'src').h + (@get 'src').y
  create: (src, dest) ->
    new Viewport
      src: src
      dest: dest
