type = require './type.coffee'
Relation = require './Relation.coffee'
Attribute = Relation.Attribute
Interval = require './Interval.coffee'
_ = require 'underscore'
min = _.min
max = _.max

class Scale
  apply: (attribute) ->
    type attribute, Attribute
    values = attribute.values()
    src = new Interval (min values), (max values)
    dest = new Interval 0, 1
    normalize = (key) -> src.to dest, attribute.map[key]

    name = attribute.name
    keys = attribute.keys
    map = {}
    for key in keys
      map[key] = normalize key
    new Attribute name, keys, map

module.exports = Scale
