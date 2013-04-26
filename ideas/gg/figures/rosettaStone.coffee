# Functions
square = (x) -> x * x

# Conditions that return values
factorial = (x) ->
  if x < 1
    1
  else
    x * (factorial x - 1)

# Objects literals
person =
  firstName: "Joe"
  lastName: "Schmoe"

# Object access
if person['firstName']
  console.log person.firstName # Joe

# Object destructuring, string interpolation
sayHello = ({firstName, lastName}) ->
  "Hi, I'm #{firstName} #{lastName}"

# Array comprehensions
squares = for num in list
  square num

# Could also be on one line
# square = (square num for num in list)

