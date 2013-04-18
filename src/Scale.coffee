define [], ->
  class Scale
    constructor: (@dim, @min = undefined, @max = undefined) ->
    init: (varset) ->
      i = @dim - 1
      if @min == undefined
        #TODO avoid creating new arrays to compute min and max
        @min = _.min (_.map varset.tuples(), (tuple) -> tuple[i])
      if @max == undefined
        @max = _.max (_.map varset.tuples(), (tuple) -> tuple[i])
    value: (tuple) ->
      (tuple[@dim-1] - @min)/(@max - @min)
