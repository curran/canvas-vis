define ['jquery.csv', 'cv/Relation'], (csv, Relation) ->
  (fileName) ->
    console.log 'loading file '+fileName
    $.get fileName, (data) ->
      table = $.csv.toArrays data
      attrNames = _.first table
      console.log attrNames
      tupleArrays = _.rest table

      relation = new Relation
      relation.addAttribute name for name in attrNames

      #relation.attributes.each (attr) -> console.log 'a:'+attr.name

      n = attrNames.length
      _.each tupleArrays, (tupleArr) ->
        tuple = {}
        for i in [0...n]
          tuple[attrNames[i]] = tupleArr[i]
        relation.addTuple tuple

      relation.tuples.each (tuple) -> console.log tuple.values
