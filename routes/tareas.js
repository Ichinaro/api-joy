const express = require('express');
const passport = require('passport');
const TareasService = require('../services/tareas');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

const {
  movieIdSchema,
  updateMovieSchema,
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
  app.use('/api/tareas', router);

  const tareasService = new TareasService();

  router.get(
    '/',
    //passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
      cacheResponse(res, ONE_MINUTES_IN_SECONDS); //tiene menos tiempo por que es mas probable que se agregen peliculas a que se editen
      const { tags } = req.query;

      try {
        const movies = await tareasService.getMovies({ tags });
        res.status(200).json({
          data: movies,
          message: 'tareas listed',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  //validationHandler compara el esquema de movieId con el parametro
  router.get(
    '/:tareaId',
    //passport.authenticate('jwt', { session: false }),
    validationHandler({ tareaId: movieIdSchema }, 'params'),
    async function (req, res, next) {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS); //tiene mas tiempo que es menos probable que editen una pelicula, en este caso la solicitada
      const { tareaId } = req.params;

      try {
        const movies = await tareasService.getMovie({ tareaId });

        res.status(200).json({
          data: movies,
          message: 'tarea retrieved',
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
        console.log('llamado route created');
        const createdMovieId = await tareasService.createMovie({ movie });
        res.status(201).json({
          data: createdMovieId,
          message: 'tarea created',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.put(
    '/:tareaId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:data']),
    validationHandler({ tareaId: movieIdSchema }, 'params'),
    async function (req, res, next) {
      const { tareaId } = req.params;
      const { body: movie } = req;

      try {
        const updatedMovieId = await tareasService.updateMovie({
          tareaId,
          movie,
        });

        res.status(200).json({
          data: updatedMovieId,
          message: 'tarea updated',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/:tareaId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:data']),
    validationHandler({ tareaId: movieIdSchema }, 'params'),
    async function (req, res, next) {
      const { tareaId } = req.params;

      try {
        console.log('llamado route delete');
        const deletedMovieId = await tareasService.deleteMovie({ tareaId });

        res.status(200).json({
          data: deletedMovieId,
          message: 'tarea deleted',
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
