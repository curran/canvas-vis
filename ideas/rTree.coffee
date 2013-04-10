# RTree
# =====
#
# An [RTree](http://en.wikipedia.org/wiki/R-tree) implementation (still rough).
#
define ['Rectangle'], (Rectangle) ->
  defaultBucketSize = 50
  
  insert = (node, entry, bucketSize) ->
    node.bounds.expandToFit entry.bounds
    if node.isLeaf
      if node.entries.length < bucketSize
        node.entries.push entry
      else
        split node, bucketSize
        insert node, entry, bucketSize
    else
      insert (bestChild node, entry), entry, bucketSize

  split = (node, bucketSize) ->
    child1 = new RNode; child2 = new RNode
    xMin = _.min node.entries, (e) -> e.bounds.x1
    xMax = _.max node.entries, (e) -> e.bounds.x2
    yMin = _.min node.entries, (e) -> e.bounds.y1
    yMax = _.max node.entries, (e) -> e.bounds.y2
    horizontal = xMax.bounds.x2 - xMin.bounds.x1
    vertical = yMax.bounds.y2 - yMin.bounds.y1

    if(vertical > horizontal)
      min = zMin; max = xMax
    else
      min = xMin; max = xMax

  class RTree
    constructor: (@bucketSize = defaultBucketSize) ->
      @root = new RNode
    insert: (item, bounds) ->
      insert @root, (new Entry item, bounds), @bucketSize

  RNode = ->
    @children = []
    @bounds = emptyBounds()
    @isLeaf = true
    @entries = []

  Entry = (@item, @bounds) ->

  # TODO transition to using constructors
  create: (bucketSize = 50) ->
    new RTree bucketSize
