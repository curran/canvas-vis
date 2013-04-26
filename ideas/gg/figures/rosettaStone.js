var factorial, num, person, sayHello, square, squares, trueIndeed, _ref;
square = function(x) {
  return x * x;
};
factorial = function(x) {
  if (x < 1) {
    return 1;
  } else {
    return x * (factorial(x - 1));
  }
};
person = {
  firstName: "Joe",
  lastName: "Schmoe"
};
trueIndeed = (person['firstName'] === (_ref = person.firstName) && _ref === "Joe");
sayHello = function(_arg) {
  var firstName, lastName;
  firstName = _arg.firstName, lastName = _arg.lastName;
  return "Hi, I'm " + firstName + " " + lastName;
};
squares = (function() {
  var _i, _len, _results;
  _results = [];
  for (_i = 0, _len = list.length; _i < _len; _i++) {
    num = list[_i];
    _results.push(square(num));
  }
  return _results;
})();
