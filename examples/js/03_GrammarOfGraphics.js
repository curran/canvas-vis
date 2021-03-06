//@ sourceMappingURL=03_GrammarOfGraphics.map
// Generated by CoffeeScript 1.6.1
(function() {

  require(['cv/Component', 'cv/bindToCanvas', 'cv/readCSV', 'cv/Viewport', 'cv/Rectangle', 'cv/mark', 'cv/grammarOfGraphics'], function(Component, bindToCanvas, readCSV, Viewport, Rectangle, mark, grammarOfGraphics) {
    var initialExpr;
    initialExpr = "DATA: x = \"petal length\"\nDATA: y = \"sepal length\"\nTRANS: x = x\nTRANS: y = y\nSCALE: linear(dim(1))\nSCALE: linear(dim(2))\nCOORD: rect(dim(1, 2))\nGUIDE: axis(dim(1))\nGUIDE: axis(dim(2))\nELEMENT: point(position(x*y))";
    return readCSV('../data/iris.csv', function(err, variables) {
      var GGComponent, changeExpr, component, keyToMark, keys, scales, viewport, _ref;
      _ref = grammarOfGraphics.execute(variables, initialExpr), keys = _ref[0], scales = _ref[1], keyToMark = _ref[2];
      viewport = new Viewport;
      GGComponent = Component.extend({
        paint: function(ctx, bounds) {
          var key, _i, _len, _results;
          ctx.clearRect(0, 0, bounds.w, bounds.h);
          viewport.dest.copy(bounds);
          _results = [];
          for (_i = 0, _len = keys.length; _i < _len; _i++) {
            key = keys[_i];
            _results.push((keyToMark(key, scales)).render(ctx, viewport));
          }
          return _results;
        }
      });
      component = new GGComponent;
      bindToCanvas('grammarOfGraphics', component);
      changeExpr = function(expr) {
        var _ref1;
        _ref1 = grammarOfGraphics.execute(variables, expr), keys = _ref1[0], scales = _ref1[1], keyToMark = _ref1[2];
        return component.trigger('graphicsDirty');
      };
      expressionBox.value = initialExpr;
      return expressionBox.addEventListener('input', function() {
        try {
          errorDiv.innerHTML = '';
          return changeExpr(expressionBox.value);
        } catch (error) {
          return errorDiv.innerHTML = error;
        }
      });
    });
  });

}).call(this);
