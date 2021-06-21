const express = require('express');
const passport = require('passport');
const LecturaService = require('../services/lectura');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

const {
  movieIdSchema,
} = require('../utils/schemas/movies');

const validationHandler = require('../utils/middleware/validationHandler');

const cacheResponse = require('../utils/cacheResponse');
const {
  FIVE_MINUTES_IN_SECONDS,
  ONE_MINUTES_IN_SECONDS,
} = require('../utils/time');

//JWT STRATEGY
require('../utils/auth/strategies/jwt'); // retorna ...user con los scopes

function moviesApi(app) {
  const router = express.Router();
  app.use('/api/lectura', router);

  const lecturaService = new LecturaService();

  router.get(
    '/',
    //passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
      cacheResponse(res, ONE_MINUTES_IN_SECONDS); //tiene menos tiempo por que es mas probable que se agregen peliculas a que se editen
      const { tags } = req.query;

      try {
        const movies = await lecturaService.getMovies({ tags });
        res.status(200).json({
          data: movies,
          message: 'articulos listed',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  //validationHandler compara el esquema de movieId con el parametro
  router.get(
    '/:articuloId',
    //passport.authenticate('jwt', { session: false }),
    validationHandler({ articuloId: movieIdSchema }, 'params'),
    async function (req, res, next) {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS); //tiene mas tiempo que es menos probable que editen una pelicula, en este caso la solicitada
      const { articuloId } = req.params;

      try {
        const movies = await lecturaService.getMovie({ articuloId });

        res.status(200).json({
          data: movies,
          message: 'articulo retrieved',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  //validationHandler compara el esquema createMovieSchema con el body (por defecto)
  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:data']),
    async function (req, res, next) {
      const { body: movie } = req;
      try {
        console.log('llamado route delete');
        const createdMovieId = await lecturaService.createMovie({ movie });
        res.status(201).json({
          data: createdMovieId,
          message: 'articulo created',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.put(
    '/:articuloId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:data']),
    validationHandler({ articuloId: movieIdSchema }, 'params'),
    async function (req, res, next) {
      const { articuloId } = req.params;
      const { body: movie } = req;

      try {
        const updatedMovieId = await lecturaService.updateMovie({
          articuloId,
          movie,
        });

        res.status(200).json({
          data: updatedMovieId,
          message: 'articulo updated',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/:articuloId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:data']),
    validationHandler({ articuloId: movieIdSchema }, 'params'),
    async function (req, res, next) {
      const { articuloId } = req.params;

      try {
        console.log('llamado route delete');
        const deletedMovieId = await lecturaService.deleteMovie({ articuloId });

        res.status(200).json({
          data: deletedMovieId,
          message: 'articulo deleted',
        });
      } catch (err) {
        next(err);
      }
    }
  );
}

module.exports = moviesApi;

// los controlladores = es toda la capa del middlewares, y del router (get,post,put,ect)comunicación con api donde se recibe y se envía JSON
//los controlladores solo llaman servicios, pero los servicios si llaman a otros servicios y librerías bases de datos u otras apis
//La unica responsabilidad de la rutas en como recibir parametros y como se los envia a los servicios
