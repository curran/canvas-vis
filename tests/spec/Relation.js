define(["cv/Relation", "cv/readCSV"], 
       function(Relation, readCSV){
  describe("Relation", function() {
    var rel = new Relation(),
        attrA, attrB, attrC;

    it("should store and retrieve attributes", function(){
      attrA = rel.addAttribute('A');
      attrB = rel.addAttribute('B');
      attrC = rel.addAttribute('C');
      expect(rel.attributes.at(0).name).toEqual('A');
      expect(rel.attributes.at(2).name).toEqual('C');
    });

    it("should store and retrieve tuples", function(){
      //            A B C
      rel.addTuple([0,1,2]);
      rel.addTuple([3,4,5]);
      rel.addTuple([6,7,8]);
      expect(rel.tuples.at(0).value(attrA)).toEqual(0);
      expect(rel.tuples.at(2).value(attrB)).toEqual(7);
    });

    it("should compute min and max", function(){
      rel.computeMinMax();
      expect(attrA.max).toEqual(6);
      expect(attrB.min).toEqual(1);
    });
  });
});
