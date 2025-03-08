const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')
const movies = require('./Resources/movies.json')
const { validateMovies, validatePartialMovie } = require('./Schemas/movies')

const app = express()
app.disable('x-powered-by')
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))
app.use(express.json())

// Obtener película por Género

app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase)
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

// Buscar por ID

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'Movie not found' })
})

// Subir Película a BD

app.post('/movies', (req, res) => {
  const result = validateMovies(req.body)

  if (result.error) {
    return res.status(400).json({ error: result.error.message })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  movies.push(newMovie)

  res.status(201).json(newMovie)
})

// Eliminar Película

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not Found' })
  }

  movies.splice(movieIndex, 1)
  return res.json({ message: 'Movie deleted successfully' })
})

// Actualizar datos de una película

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const result = validatePartialMovie(req.body)
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not Found' })
  }
  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie
  return res.json(updateMovie)
})

// Escuchar al puerto
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
