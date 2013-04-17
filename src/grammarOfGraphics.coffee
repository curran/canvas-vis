#grammarOfGraphics
#=================
# The top level module exposing Grammar of Graphics functionality.
#
# For inner modules, check out [grammarOfGraphics docs](grammarOfGraphics.html)
require [
  'cv/grammarOfGraphics/parser',
  'cv/grammarOfGraphics/printTree',
  'cv/grammarOfGraphics/step1_variables'
#  'cv/grammarOfGraphics/step2_variables',
#  'cv/grammarOfGraphics/step3_algebra',
#  'cv/grammarOfGraphics/step4_scales',
#  'cv/grammarOfGraphics/step5_statistics',
#  'cv/grammarOfGraphics/step6_geometry',
#  'cv/grammarOfGraphics/step7_coordinates',
#  'cv/grammarOfGraphics/step8_aesthetics',
#  'cv/grammarOfGraphics/step9_renderer'
], (parser, printTree, step1) ->
  
  testInput = """
    DATA: response = response
    DATA: gender = Gender
    SCALE: cat(dim(1), values("Rarely", "Infrequently"))
    SCALE: cat(dim(2), values("Female", "Male"))
    COORD: rect(dim(2),polar.theta(dim(1)))
    ELEMENT: interval.stack(position(summary.proportion(response * gender)), label(response), color(response))
  """

  #console.log printTree parser.parse testInput

  grammarOfGraphics = (variables, expression) ->
    tree = parser.parse expression
    variables = step1 tree, variables
    tree = step2 tree, variables

  return grammarOfGraphics
