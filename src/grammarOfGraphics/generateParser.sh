# npm install -g pegjs
pegjs -e parser parser.peg

# This script wraps the generated parser as an AMD module
# so it can be used with Require.js
mv parser.js temp.js
echo "define([],function(){" > parser.js
cat temp.js >> parser.js
echo "return parser;});" >> parser.js
rm temp.js
