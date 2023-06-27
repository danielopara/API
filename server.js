const http = require('http')
const port = 2020
const app = require('./app')

const server = http.createServer(app)
server.listen(port)