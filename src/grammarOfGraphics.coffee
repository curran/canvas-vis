#grammarOfGraphics
#=================
# The top level module exposing Grammar of Graphics functionality.
#
# For inner modules, check out [grammarOfGraphics docs](grammarOfGraphics.html)
define [
  'cv/grammarOfGraphics/parser',
  'cv/grammarOfGraphics/step1_variables',
  'cv/grammarOfGraphics/step2_algebra'
#  'cv/grammarOfGraphics/step3_scales',
#  'cv/grammarOfGraphics/step4_statistics',
#  'cv/grammarOfGraphics/step5_geometry',
#  'cv/grammarOfGraphics/step6_coordinates',
#  'cv/grammarOfGraphics/step7_aesthetics',
#  'cv/grammarOfGraphics/step8_renderer'
], (parser, step1, step2) ->
  (variables, expression) ->
    tree = parser.parse expression
    variables = step1 tree, variables
    step2 tree, variables
