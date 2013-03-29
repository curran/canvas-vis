define(["cv/Rectangle", "cv/Viewport", "cv/Point"], 
       function(Rectangle, Viewport, Point){
  describe("Viewport", function() {
    var src = Rectangle.create(10, 20, 40, 80),
        dest = Rectangle.create(0, 0, 1, 1),
        viewport = Viewport.create(src, dest),
        inPt = Point.create(),
        outPt = Point.create();

    it("should transform from src to dest", function(){
      inPt.set(30, 60);
      viewport.srcToDest(inPt, outPt);
      expect(outPt.x).toEqual(0.5);
      expect(outPt.y).toEqual(0.5);
    });
    it("should transform from dest to src", function(){
      inPt.set(0.5, 0.5);
      viewport.destToSrc(inPt, outPt);
      expect(outPt.x).toEqual(30);
      expect(outPt.y).toEqual(60);
    });
  });
});
