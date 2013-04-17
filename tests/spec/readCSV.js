define(['cv/readCSV'], function(readCSV){
  describe("readCSV", function() {
    it("should read a CSV file", function(){
      var csvLoaded = false, csvColumns;

      waitsFor(function() {
        return csvLoaded;
      }, "CSV never loaded!", 1000);

      readCSV('../data/iris.csv', function(err, variables){
        csvColumns = variables
        csvLoaded = true;
      });

      runs( function(){
        var names = _.keys(csvColumns);
        expect(_(names).contains("sepal width")).toEqual(true);
        expect(_(names).contains("bananas")).toEqual(false);

        var col = csvColumns['petal length'];
        expect(col.keys().length).toEqual(150);
        expect(col.value(5)).toEqual('1.7');
      });
    });
  });
});
