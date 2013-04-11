# Build the documentation
cat src/*.coffee > canvas-vis.coffee
cat examples/*.coffee > examples.coffee
docco *.coffee
rm canvas-vis.coffee
mv examples.coffee docs
