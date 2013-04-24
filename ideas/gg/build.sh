# Compile and bundle sources
browserify -d -t coffeeify main.coffee > bundle.js

# Launch a local static file server
coffee server.coffee
