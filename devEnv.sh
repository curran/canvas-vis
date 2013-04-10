# My Development Environment
#
#   * Unix
#   * Vim
#   * Vim CoffeeScript plugin
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
# Run this script once and leave it running in a visible terminal:
#
#   * Serves the `canvas-vis` directory tree at [http://localhost:8080](http://localhost:8080)
cd server
node app.js &
cd ../
#   * Recompiles CoffeeScript source files into "canvas-vis.js" when they are changed.
coffee -o js -cmw src
