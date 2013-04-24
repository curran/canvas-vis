# Build the parser
# (npm install -g pegjs)
pegjs -e module.exports parser.peg

# Compile and bundle sources
browserify -d -t coffeeify main.coffee > bundle.js

# Launch a local static file server
coffee server.coffee
