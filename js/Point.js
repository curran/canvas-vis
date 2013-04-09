//@ sourceMappingURL=Point.map
// Generated by CoffeeScript 1.6.1
(function() {

  define(['cv/expose'], function(expose) {
    return Backbone.Model.extend({
      initialize: function() {
        expose(this, 'x', 'y');
        return _.defaults(this, {
          x: 0,
          y: 0
        });
      },
      setXY: function(x, y) {
        this.x = x;
        this.y = y;
      }
    });
  });

}).call(this);
