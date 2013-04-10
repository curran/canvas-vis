//@ sourceMappingURL=Rectangle.map
// Generated by CoffeeScript 1.6.1
(function() {

  define(['cv/expose'], function(expose) {
    return Backbone.Model.extend({
      initialize: function() {
        return expose(this, 'x', 'y', 'w', 'h');
      },
      copy: function(rectangle) {
        this.x = rectangle.x;
        this.y = rectangle.y;
        this.w = rectangle.w;
        return this.h = rectangle.h;
      }
    });
  });

}).call(this);
