define(["cv/Container", "cv/Component"], 
       function(Container, Component) {
  describe("Container", function() {
    var container = Container.create(),
        child = Component.create(),
        graphicsDirty = false;

    container.on('graphicsDirty', function(){
      graphicsDirty = true;
    });

    it("should fire 'graphicsDirty' when child added", function(){ 
      expect(graphicsDirty).toEqual(false);
      container.add(child);
      expect(graphicsDirty).toEqual(true);
    });

    it("should propagate 'graphicsDirty' to parent", function(){ 
      graphicsDirty = false;

      expect(graphicsDirty).toEqual(false);
      child.trigger('graphicsDirty');
      expect(graphicsDirty).toEqual(true);
    });
  });
});
