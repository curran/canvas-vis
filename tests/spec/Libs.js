define(["underscore", "backbone"], function(_, Backbone) {
  describe("Underscore", function() {
    it("should compute min", function(){
      expect(_.min([6, 5, 8])).toEqual(5);
    });
  });
  describe("Backbone", function() {
    it("should fire an event", function(){
      var x = {}, changed = false;
      _.extend(x, Backbone.Events);
      x.on('change', function(){
        changed = true;
      });
      expect(changed).toEqual(false);
      x.trigger('change');
      expect(changed).toEqual(true);
    });
  });
});
