# To build the documentation, run this script.
cat src/* > canvas-vis.coffee
docco *.coffee
rm canvas-vis.coffee
