match = require './match.coffee'
getFile = require './getFile.coffee'
_ = require 'underscore'
map = _.map
compact = _.compact
async = require 'async'
Relation = require './Relation.coffee'

# callback(err, vars:Map<String, Relation.Attribute>)
processSourceStmts = (ast, callback) ->
  sources = extractSources ast
  getRelations sources, (err, relations) ->
    vars = {}
    for relation in relations
      for attr in relation.attributes
        vars[attr.name] = attr
    callback null, vars

#TODO rename to extractSourceStmts
extractSources = match
  Program: ({stmts}) ->
    compact map stmts, extractSources
  Source: (s) -> s
  AST: ->

# callback(err, [[name:String, Relation]])
getRelations = (sources, callback) ->
  async.map sources, getRelation, callback

# callback(err, [name:String, Relation])
getRelation = (source, callback) ->
  getFile source.csvPath, (err, csvText) ->
    callback null, new Relation $.csv.toArrays csvText

module.exports = processSourceStmts
