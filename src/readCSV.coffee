define ['jquery.csv', 'cv/Variable'], (csv, Variable) ->
  (fileName, callback) ->
    $.get fileName, (data) ->
      table = $.csv.toArrays data
      columnNames = _.first table
      m = columnNames.length
      tuples = _.rest table
      key = 0

      variables = {}
      variablesArr = []
      key = 0
      for name in columnNames
        variablesArr.push( variables[name] = new Variable )
      for tuple in tuples
        for i in [0...m]
          # TODO if keyColumn specified then use it
          variable = variablesArr[i]
          variable.addEntry key, tuple[i]
        key++

      callback null, variables

#      relation = new Relation
#      relation.addAttribute name for name in attrNames
#      relation.addTuple tuple for tuple in tuples
#      relation.computeMinMax()
#
#      callback null, relation
