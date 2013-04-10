define ['jquery.csv', 'cv/Relation'], (csv, Relation) ->
  (fileName, callback) ->
    $.get fileName, (data) ->
      table = $.csv.toArrays data
      attrNames = _.first table
      tupleArrays = _.rest table

      relation = new Relation

      relation.addAttribute name for name in attrNames

      # Construct tuple objects from tuple arrays.
      n = attrNames.length
      _.each tupleArrays, (tupleArr) ->
        tuple = {}
        for i in [0...n]
          tuple[attrNames[i]] = tupleArr[i]
        relation.addTuple tuple

      relation.computeMinMax()

      callback null, relation
