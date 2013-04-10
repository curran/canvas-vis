# Build the documentation
cat src/* > canvas-vis.coffee
docco *.coffee
rm canvas-vis.coffee
