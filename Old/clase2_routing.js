const http = require('node:http')

const json = require('../Resources/ditto.json')

const proccesRequest = (req, res) => {
  const { method, url } = req

  switch (method) {
    case 'GET':
      switch (url) {
        case '/pokemon/ditto':
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify(json))
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/plain')
          return res.end('La página no existe. Error 404')
      }
    case 'POST':
      switch (url) {
        case '/pokemon': {
          let body = ''

          req.on('data', (chunk) => {
            body += chunk.toString()
          })
          req.on('end', () => {
            const data = JSON.parse(body)
            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' })
            data.timestamp = Date.now()
            res.end(JSON.stringify(data))
          })
          break
        }
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/plain')
          return res.end('La página no existe. Error 404')
      }
  }
}

const server = http.createServer(proccesRequest)

server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000')
})
