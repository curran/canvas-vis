# My Development Environment
#
#   * Unix
#   * Vim
#   * Vim CoffeeScript plugin
#   * git
#   * Node.js
#
# Run this script once and leave it running in a visible terminal:
#
#   * Serves the `canvas-vis` directory tree at [http://localhost:8080](http://localhost:8080)
cd server
node app.js &
cd ../
#   * Recompiles CoffeeScript source files into "canvas-vis.js" when they are changed.
coffee -o js -cmw src
