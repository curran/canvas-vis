//@ sourceMappingURL=Dimension.map
// Generated by CoffeeScript 1.6.1
(function() {

  define(['cv/expose'], function(expose) {
    return Backbone.Model.extend({
      initialize: function() {
        return expose(this, 'w', 'h');
      },
      setWH: function(w, h) {
        this.w = w;
        this.h = h;
      }
    });
  });

}).call(this);