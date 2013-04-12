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

    it("should compute projection", function(){
      rel2 = rel.project([attrA])
      expect(rel2.attributes.length).toEqual(1);
      expect(rel2.attributes.at(0)).toEqual(attrA);
      expect(rel2.tuples.at(1).value(attrA)).toEqual(3);

      rel3 = rel.project([attrA, attrC])
      expect(rel3.attributes.length).toEqual(2);
      expect(rel3.attributes.at(1)).toEqual(attrC);
      expect(rel3.tuples.at(1).value(attrA)).toEqual(3);
      expect(rel3.tuples.at(1).value(attrC)).toEqual(5);
    });

    it("should compute selection", function(){
      rel4 = rel.select(function(tuple){
        return tuple.value(attrA) > 0;
      })
      expect(rel4.attributes.length).toEqual(3);
      expect(rel4.tuples.length).toEqual(2);
      expect(rel4.tuples.at(0).value(attrA)).toEqual(3);
      expect(rel4.tuples.at(1).value(attrA)).toEqual(6);

      rel3 = rel.project([attrA, attrC])
      expect(rel3.attributes.length).toEqual(2);
      expect(rel3.attributes.at(1)).toEqual(attrC);
      expect(rel3.tuples.at(1).value(attrA)).toEqual(3);
      expect(rel3.tuples.at(1).value(attrC)).toEqual(5);
    });
  });
});
