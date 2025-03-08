const http = require('http')

const desiredPort = process.env.PORT ?? 3000

const proccesRequest = (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  if (req.url === '/') {
    res.statusCode = 200
    res.end('Bienvenido a la página más piola!')
  } else if (req.url === '/contact') {
    res.statusCode = 200
    res.end('Bienvenido a la página de contacto')
  } else {
    res.statusCode = 404
    res.end('La página no existe. Error 404')
  }
}

const server = http.createServer(proccesRequest)

server.listen(desiredPort, () => {
  console.log(`Server running on port http://localhost:${desiredPort}`)
})
