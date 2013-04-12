define ['jquery.csv', 'cv/Relation'], (csv, Relation) ->
  (fileName, callback) ->
    $.get fileName, (data) ->
      table = $.csv.toArrays data
      attrNames = _.first table
      tuples = _.rest table

      relation = new Relation
      relation.addAttribute name for name in attrNames
      relation.addTuple tuple for tuple in tuples
      relation.computeMinMax()

      callback null, relation
