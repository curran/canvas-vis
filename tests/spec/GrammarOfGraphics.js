define( [
  'cv/readCSV',
  'cv/grammarOfGraphics',
  'cv/grammarOfGraphics/parser',
  'cv/grammarOfGraphics/printTree',
  'cv/grammarOfGraphics/step1_variables'
], function(readCSV, gg, parser, printTree, step1){
  describe("Grammar of Graphics", function() {
    it("should compute step 1: variables", function(){
      readCSV('../data/iris.csv', function(err, variables){
        var xVar = variables['petal length'];
        var yVar = variables['sepal length'];
        var testExpr = [
          'DATA: x = "petal length"',
          'DATA: y = "sepal length"',
          'TRANS: x = x',
          'TRANS: y = y',
          'SCALE: linear(dim(1))',
          'SCALE: linear(dim(2))',
          'COORD: rect(dim(1, 2))',
          'GUIDE: axis(dim(1))',
          'GUIDE: axis(dim(2))',
          'ELEMENT: point(position(x*y))',
        ].join('\n');

        var tree = parser.parse(testExpr);
        variables = step1(tree, variables);

        var names = _.keys(variables);
        expect(_(names).contains("sepal width")).toEqual(true);
        expect(_(names).contains("x")).toEqual(false);
      });
    });
  });
});
