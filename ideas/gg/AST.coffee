class AST

class Add extends AST
  constructor: (@a, @b) ->

AST.Add = Add
module.exports = AST
