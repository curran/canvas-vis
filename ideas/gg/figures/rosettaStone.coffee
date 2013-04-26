
# Functions
square = (x) -> x * x

# Conditions as expressions that return a value, function invocation
factorial = (x) ->
  if x < 1
    1
  else
    x * (factorial x - 1)

# Could also be on one line
# factorial = (x) -> if x < 1 then 1 else x * (factorial x - 1)

# Objects literals
person =
  firstName: "Joe"
  lastName: "Schmoe"

# Object access
trueIndeed = person['firstName'] == person.firstName == "Joe"

# Object destructuring and string interpolation
sayHello = ({firstName, lastName}) ->
  "Hi, I'm #{firstName} #{lastName}"

# Array comprehensions
squares = for num in list
  square num 

# Could also be on one line
# square = (square num for num in list)

