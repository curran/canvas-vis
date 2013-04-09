define(["cv/Rectangle", "cv/Viewport", "cv/Point"], 
       function(Rectangle, Viewport, Point){
  describe("Viewport", function() {
    var src = new Rectangle({x:10, y:20, w:40, h:80}),
        dest = new Rectangle({x:0, y:0, w:1, h:1}),
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
