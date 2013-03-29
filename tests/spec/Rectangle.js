define(["cv/Rectangle"], function(Rectangle) {
  describe("Rectangle", function() {
    var rectangle = Rectangle.create(10, 20, 30, 40);
    it("should set x, y, w, h on new Rectangles", function(){
      expect(rectangle.x).toEqual(10);
      expect(rectangle.y).toEqual(20);
      expect(rectangle.w).toEqual(30);
      expect(rectangle.h).toEqual(40);
    });
    it("should compute x1, y1, x2, y2", function(){
      expect(rectangle.x1).toEqual(rectangle.x);
      expect(rectangle.y1).toEqual(rectangle.y);
      expect(rectangle.x2).toEqual(rectangle.x + rectangle.w);
      expect(rectangle.y2).toEqual(rectangle.y + rectangle.h);
    });
  });
});
