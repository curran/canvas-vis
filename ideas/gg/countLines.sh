rm bundle.js
rm parser.js
#find . -path ./node_modules -prune -o -name '*.*' | xargs wc -l
find . -type d \( -path ./node_modules -o -path ./lib -o -path ./data \) -prune -o -name '*.*' | xargs wc -l
