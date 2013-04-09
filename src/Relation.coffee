# Some ideas for defining relations (as in tables) using Backbone.
define [], ->

  Model = Backbone.Model
  Collection = Backbone.Collection

  Relation = Model.extend
    initialize: () ->
      @columns = new Collection model: Column
      @rows = new Collection model: Row
    addColumn: (name) -> @columns.add new Column {name}
    addRow:    (values) -> @rows.add  new Row {values}
    computeMinMax: () -> @columns.each (column) =>
      column.set
        min: @rows.min (row) -> row.values[column.index]
        max: @rows.max (row) -> row.values[column.index]

  Row = Model.extend()
    # use property `data` = an array of literal values

  Column = Model.extend()
    # use properties `name`, `min`, `max`

  r = new Relation
  r.addColumn 'Country'
  r.addColumn 'Year'
  r.addColumn 'Population'
  # Data crowdsourced from Amazon Mechanical Turk
  r.addRow ['India',          1950, 369880000]
  r.addRow ['China',          1950, 554760000]
  r.addRow ['United States', 1950, 150697361]
  r.addRow ['India',         2010, 1150000000]
  r.addRow ['China',         2010, 1339724852]
  r.addRow ['United States', 2010, 308745538]
  r.computeMinMax()
   
  Relation.example = r

  return Relation
