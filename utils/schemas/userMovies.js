const joi = require('@hapi/joi');

const { movieIdSchema } = require('./movies'); //id de la pelicula
const { userIdSchema } = require('./users'); //id del usuario

const userMovieIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/); //¿id de la pelicula del usuario en favoritos

//¿esquema cuando el usuario cree peliculas
const createUserMovieSchema = {
  userId: userIdSchema.required(),
  movieId: movieIdSchema.required(),
};

module.exports = {
  userMovieIdSchema,
  createUserMovieSchema,
};
