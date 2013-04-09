# The 'src' directory contains CoffeeScript source code.
# The 'js' directory contains JavaScript files generated
# from compiling the CoffeeScript source.
#
# I like to develop this codebase with the following setup:
#
# In one terminal, run this script and keep it running.
# In another terminal, edit the source code.
#
# This script sets up the CoffeeScript compiler to watch 
# for source changes and update the 'js' directory when 
# source files change. The compiler outputs errors
# when newly saved source files fail to compile. 
# I like to keep this running script visible so 
# compiler errors are spotted right away.

# First clear out 'js', to ensure destination files 
# corresponding to deleted source files are removed 
# at some point.
rm -r js

# Set up CoffeeScript for watching and compiling in `src`.
coffee -o js -cmw src &

# Set up CoffeeScript for watching and compiling in `examples`.
coffee -o examples/js -cmw examples
