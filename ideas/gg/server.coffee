express = require 'express'
app = express()
port = 8080

app.use express.static  __dirname
app.use express.directory  __dirname

app.listen port
console.log "Serving at localhost:#{port}"
