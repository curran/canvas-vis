type = require './type.coffee'
class Interval
  constructor: (@min, @max) ->
    type @min, Number
    type @max, Number
  span: -> @max - @min
  to: (interval, value) ->
    type interval, Interval
    type value, Number
    (value - @min) / @span() * interval.span() + interval.min

module.exports = Interval
