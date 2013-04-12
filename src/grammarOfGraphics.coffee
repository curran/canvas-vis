require ['cv/grammarOfGraphics/parser', 'cv/grammarOfGraphics/printTree']
      , (parser, printTree) ->
  
  testInput0 = """
    DATA: response = response
    DATA: gender = Gender
    SCALE: cat(dim(1), values("Rarely", "Infrequently"))
    SCALE: cat(dim(2), values("Female", "Male"))
    COORD: rect(dim(2),polar.theta(dim(1)))
    ELEMENT: interval.stack(position(summary.proportion(response * gender)), label(response), color(response))
  """

  testInput = """
    DATA: x = x*y
    DATA: y = y
    TRANS: x = x
    TRANS: y = y
    SCALE: linear(dim(1))
    SCALE: linear(dim(2))
    COORD: rect(dim(1, 2))
    GUIDE: axis(dim(1))
    GUIDE: axis(dim(2))
    ELEMENT: point(position(x*y))
  """


  # TODO variables, algebra, scales, statistics, geometry, coordinates, aesthetics, renderer

  console.log printTree parser.parse testInput

