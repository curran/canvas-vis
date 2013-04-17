define(['cv/readCSV'], function(readCSV){
  describe("readCSV", function() {
    it("should read a CSV file", function(){
      readCSV('../data/iris.csv', function(err, variables){
        var names = _.keys(variables);
        expect(_(names).contains("sepal width")).toEqual(true);
        expect(_(names).contains("bananas")).toEqual(false);

        var col = variables['petal length'];
        expect(col.keys().length).toEqual(150);
        expect(col.value(5)).toEqual(1.7);
      });
    });
  });
});
