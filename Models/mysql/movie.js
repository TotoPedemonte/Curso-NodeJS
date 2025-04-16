import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      const [genres] = await connection.query(
        'SELECT id, name FROM genres WHERE LOWER(name) = ?;',
        [lowerCaseGenre]
      )

      // no genre found
      if (genres.length === 0) return []

      // get the id from the first genre result
      const [{ id }] = genres

      const [movies] = await connection.query(
        'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movies INNER JOIN movie_genres ON movies.id = movie_genres.movie_id WHERE movie_genres.genre_id = ?;',
        [id]
      )

      return movies
    }

    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movies;'
    )

    return movies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movies WHERE id = UUID_TO_BIN(?);',
      [id]
    )

    if (movies.length === 0) return null

    return movies[0]
  }

  static async create ({ input }) {
    const {
      genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        `INSERT INTO movies (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN('${uuid}'), ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate]
      )
    } catch (e) {
      throw new Error('Error creating movie')
    }

    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movies WHERE id = UUID_TO_BIN(?);',
      [uuid]
    )

    if (movies.length === 0) return null

    return movies[0]
  }

  static async delete ({ id }) {
    try {
      await connection.query('DELETE FROM movies WHERE id = UUID_TO_BIN(?);', [id])
      return true
    } catch (e) {
      throw new Error('Error deleting movie')
    }
  }

  static async update ({ id, input }) {

  }
}
