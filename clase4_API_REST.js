import express, { json } from 'express' // require -> commonJS
import { moviesRouter } from './Routes/movies.js'
import { corsMiddleware } from './Middleware/cors.js'

const app = express()
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
