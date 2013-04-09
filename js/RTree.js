//@ sourceMappingURL=RTree.map
// Generated by CoffeeScript 1.6.1
(function() {

  define(['Rectangle'], function(Rectangle) {
    var Entry, RNode, RTree, defaultBucketSize, insert, split;
    defaultBucketSize = 50;
    insert = function(node, entry, bucketSize) {
      node.bounds.expandToFit(entry.bounds);
      if (node.isLeaf) {
        if (node.entries.length < bucketSize) {
          return node.entries.push(entry);
        } else {
          split(node, bucketSize);
          return insert(node, entry, bucketSize);
        }
      } else {
        return insert(bestChild(node, entry), entry, bucketSize);
      }
    };
    split = function(node, bucketSize) {
      var child1, child2, horizontal, max, min, vertical, xMax, xMin, yMax, yMin;
      child1 = new RNode;
      child2 = new RNode;
      xMin = _.min(node.entries, function(e) {
        return e.bounds.x1;
      });
      xMax = _.max(node.entries, function(e) {
        return e.bounds.x2;
      });
      yMin = _.min(node.entries, function(e) {
        return e.bounds.y1;
      });
      yMax = _.max(node.entries, function(e) {
        return e.bounds.y2;
      });
      horizontal = xMax.bounds.x2 - xMin.bounds.x1;
      vertical = yMax.bounds.y2 - yMin.bounds.y1;
      if (vertical > horizontal) {
        min = zMin;
        return max = xMax;
      } else {
        min = xMin;
        return max = xMax;
      }
    };
    RTree = (function() {

      function RTree(bucketSize) {
        this.bucketSize = bucketSize != null ? bucketSize : defaultBucketSize;
        this.root = new RNode;
      }

      RTree.prototype.insert = function(item, bounds) {
        return insert(this.root, new Entry(item, bounds), this.bucketSize);
      };

      return RTree;

    })();
    RNode = (function() {

      function RNode() {
        this.children = [];
        this.bounds = emptyBounds();
        this.isLeaf = true;
        this.entries = [];
      }

      return RNode;

    })();
    Entry = (function() {

      function Entry(item, bounds) {
        this.item = item;
        this.bounds = bounds;
      }

      return Entry;

    })();
    return {
      create: function(bucketSize) {
        if (bucketSize == null) {
          bucketSize = 50;
        }
        return new RTree(bucketSize);
      }
    };
  });

}).call(this);
