# My Development Environment
#
#   * Unix
#   * Vim (with CoffeeScript plugin)
#   * git
#   * Node.js
#
# To install the requisite stuff in Ubuntu:
#
#   * `sudo apt-get install git -y`
#   * `sudo apt-get install python-software-properties python g++ make -y` ([source](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#ubuntu))
#   * `sudo apt-get install software-properties-common -y`
#   * `sudo add-apt-repository ppa:chris-lea/node.js`
#   * `sudo apt-get update`
#   * `sudo apt-get install nodejs -y`
#
# Run this script to compile everything

# Clean out the JS directory
rm -r js
mkdir js
mkdir js/grammarOfGraphics

echo Compiling CoffeeScript sources from src/ into js/
coffee -o js -cm src &

echo Compiling CoffeeScript sources from examples/ into examples/js/
cd examples
coffee -o js -cm ./
cd ../

echo Generating Grammar of Graphics parser from PEG.js grammar
cd src/grammarOfGraphics
bash generateParser.sh
cd ../../
mv src/grammarOfGraphics/parser.js js/grammarOfGraphics

echo Building docs
cat src/*.coffee > canvas-vis.coffee
cat examples/*.coffee > examples.coffee
docco *.coffee
rm canvas-vis.coffee
mv examples.coffee docs

echo Done.
