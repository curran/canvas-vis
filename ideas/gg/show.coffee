match = require './match.coffee'
map = (require 'underscore').map

show = match
  Program: ({stmts}) -> (map stmts, show).join '\n'
  Data: ({name, expr}) -> "DATA: #{name} = #{show expr}"
  Source: ({csvPath}) -> "SOURCE: \"#{csvPath}\""
  FnStmt : ({label, fn}) -> "#{label}: #{show fn}"
  Primitive: ({value}) -> value
  Str: ({value}) -> '"'+value+'"'
  Fn: ({name, args}) -> "#{name}(#{(map args, show).join ', '})"
  Op: ({left, right, sym}) -> "#{show left}#{sym}#{show right}"
  #Relation: (r) -> "<Relation with #{r.m()} rows and #{r.n()} columns>"
  Relation: (r) -> "\n"+r.toCSV()+"\n"

module.exports = show
