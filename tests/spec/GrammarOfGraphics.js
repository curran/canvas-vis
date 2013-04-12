define( [
  'cv/Relation',
  'cv/grammarOfGraphics',
  'cv/grammarOfGraphics/parser',
  'cv/grammarOfGraphics/printTree',
  'cv/grammarOfGraphics/step1_variables'
], function(Relation, gg, parser, printTree, variables){
  describe("Grammar of Graphics", function() {
    var rel = new Relation(),
        attrA, attrB, attrC;

    attrA = rel.addAttribute('Column A');
    attrB = rel.addAttribute('Column B');
    attrC = rel.addAttribute('Column C');

    rel.addTuple([0,1,2]);
    rel.addTuple([3,4,5]);
    rel.addTuple([6,7,8]);

    testExpr = [
      'DATA: x = "Column A"',
      'DATA: y = "Column C"',
      'TRANS: x = x',
      'TRANS: y = y',
      'SCALE: linear(dim(1))',
      'SCALE: linear(dim(2))',
      'COORD: rect(dim(1, 2))',
      'GUIDE: axis(dim(1))',
      'GUIDE: axis(dim(2))',
      'ELEMENT: point(position(x*y))',
    ].join('\n');

    it("should compute step 1: variables", function(){
      var tree = parser.parse(testExpr);
      var varset = variables(tree, rel);
      window.varset = varset;
      var attrX = varset.attributes.at(0);
      var attrY = varset.attributes.at(1);

      expect(varset.attributes.length).toEqual(2);
      expect(attrX.name).toEqual('x');
      expect(attrY.name).toEqual('y');

      expect(varset.tuples.at(1).value(attrX)).toEqual(3);
      expect(varset.tuples.at(1).value(attrY)).toEqual(5);
    });

  });
});
