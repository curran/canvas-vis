#grammarOfGraphics
#=================
# The top level module exposing Grammar of Graphics functionality.
#
# For inner modules, check out [grammarOfGraphics docs](grammarOfGraphics.html)
define [
  'cv/grammarOfGraphics/parser',
  'cv/grammarOfGraphics/printTree',
  'cv/grammarOfGraphics/step1_variables',
  'cv/grammarOfGraphics/step2_algebra',
  'cv/grammarOfGraphics/step3_scales'
#  'cv/grammarOfGraphics/step4_statistics',
#  'cv/grammarOfGraphics/step5_geometry',
#  'cv/grammarOfGraphics/step6_coordinates',
#  'cv/grammarOfGraphics/step7_aesthetics',
#  'cv/grammarOfGraphics/step8_renderer'
], (parser, printTree, step1, step2, step3) ->
  (variables, expression) ->
    tree = parser.parse expression
    variables = step1 tree, variables
    tree = step2 tree, variables
    #console.log printTree tree
    console.dir (step3 tree, variables)
    return tree
