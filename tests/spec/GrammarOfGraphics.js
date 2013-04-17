define( [
  'cv/readCSV',
  'cv/grammarOfGraphics',
  'cv/grammarOfGraphics/parser',
  'cv/grammarOfGraphics/printTree',
  'cv/grammarOfGraphics/step1_variables',
  'cv/grammarOfGraphics/step2_algebra'
], function(readCSV, gg, parser, printTree, 
   step1, step2){
  var csvLoaded = false, csvColumns;
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
  describe("Grammar of Graphics", function() {
    it("should compute step 1: variables", function(){

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

//ELEMENT: point(position(pop1980))

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
    it("should compute step 2: algebra", function(){
      var tree = parser.parse(testExpr);
      var variables = step1(tree, csvColumns);
      tree = step2(tree, variables);
      var varset = _.last(tree.statements).expr.args[0].args[0];
      expect(varset.type).toEqual('varset');

// For debugging:
//      console.log(printTree(tree));
//      window.varset = varset;

      var key = Math.round(Math.random() * 50);
      var petalLength = csvColumns['petal length'].value(key);
      var sepalLength = csvColumns['sepal length'].value(key);
      var tuple = varset.tuple(key);
      expect(petalLength).toEqual(tuple[0]);
      expect(sepalLength).toEqual(tuple[1]);

//  testInput = """
//    DATA: response = response
//    DATA: gender = Gender
//    SCALE: cat(dim(1), values("Rarely", "Infrequently"))
//    SCALE: cat(dim(2), values("Female", "Male"))
//    COORD: rect(dim(2),polar.theta(dim(1)))
//    ELEMENT: interval.stack(position(summary.proportion(response * gender)), label(response), color(response))
//  """
    });
  });
});
