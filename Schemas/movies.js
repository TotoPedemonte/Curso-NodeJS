const z = require('zod')

const movieSchem = z.object({
  title: z.string({
    invalid_type_error: 'Movie Title must be a string',
    required_error: 'Movie title is required'
  }),
  year: z.number().int().min(1900).max(2030),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum(['Action', 'Aventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi'])
  )
})

function validateMovies (object) {
  return movieSchem.safeParse(object)
}

function validatePartialMovie (object) {
  return movieSchem.partial().safeParse(object)
}

module.exports = {
  validateMovies,
  validatePartialMovie
}
