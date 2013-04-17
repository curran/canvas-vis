define( [
  'cv/readCSV',
  'cv/grammarOfGraphics',
  'cv/grammarOfGraphics/parser',
  'cv/grammarOfGraphics/printTree',
  'cv/grammarOfGraphics/step1_variables'
], function(readCSV, gg, parser, printTree, step1){
  describe("Grammar of Graphics", function() {
    it("should compute step 1: variables", function(){
      var csvLoaded = false, csvColumns;

      waitsFor(function() {
        return csvLoaded;
      }, "CSV never loaded!", 1000);

      readCSV('../data/iris.csv', function(err, variables){
        csvColumns = variables
        csvLoaded = true;
      });

      runs( function(){
//        var xVar = csvColumns['petal length'];
//        var yVar = csvColumns['sepal length'];
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
        var variables = step1(tree, csvColumns);

        var names = _.keys(variables);
        expect(_(names).contains("sepal width")).toEqual(true);
        expect(_(names).contains("x")).toEqual(true);

        var key = Math.round(Math.random() * 50);
        var columnVal = csvColumns['petal length'].value(key);
        var variableVal = variables.x.value(key);
        expect(columnVal).toEqual(variableVal);
      });
    });
  });
});
