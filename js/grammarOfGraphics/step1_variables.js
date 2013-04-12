//@ sourceMappingURL=step1_variables.map
// Generated by CoffeeScript 1.6.1
(function() {

  define(['cv/match', 'cv/grammarOfGraphics/printTree'], function(match, printTree) {
    return match('type', 'variables', {
      'statements': function(statements, relation) {
        var dataStmt, dataStmts, stmts, _i, _len;
        stmts = statements.statements;
        dataStmts = _.filter(stmts, function(stmt) {
          return stmt.statementType === 'DATA';
        });
        for (_i = 0, _len = dataStmts.length; _i < _len; _i++) {
          dataStmt = dataStmts[_i];
          console.log(printTree(dataStmt.expr));
        }
        return relation;
      }
    });
  });

}).call(this);
