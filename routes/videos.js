const express = require('express');
const passport = require('passport');
const VideosService = require('../services/videos');
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
  app.use('/api/videos', router);

  const videosService = new VideosService();

  router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:data-class']),
    async function (req, res, next) {
      cacheResponse(res, ONE_MINUTES_IN_SECONDS,); //tiene menos tiempo por que es mas probable que se agregen peliculas a que se editen
      const { tags } = req.query;

      try {
        const movies = await videosService.getMovies({ tags });
        res.status(200).json({
          data: movies,
          message: 'videos listed',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  //validationHandler compara el esquema de movieId con el parametro
  router.get(
    '/:videoId',
    //passport.authenticate('jwt', { session: false }),
    validationHandler({ videoId: movieIdSchema }, 'params'),
    async function (req, res, next) {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS); //tiene mas tiempo que es menos probable que editen una pelicula, en este caso la solicitada
      const { videoId } = req.params;

      try {
        const movies = await videosService.getMovie({ videoId });

        res.status(200).json({
          data: movies,
          message: 'video retrieved',
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
        const createdMovieId = await videosService.createMovie({ movie });
        res.status(201).json({
          data: createdMovieId,
          message: 'video created',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.put(
    '/:videoId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:data']),
    validationHandler({ videoId: movieIdSchema }, 'params'),
    async function (req, res, next) {
      const { videoId } = req.params;
      const { body: movie } = req;

      try {
        const updatedMovieId = await videosService.updateMovie({
          videoId,
          movie,
        });

        res.status(200).json({
          data: updatedMovieId,
          message: 'video updated',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/:videoId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:data']),
    validationHandler({ videoId: movieIdSchema }, 'params'),
    async function (req, res, next) {
      const { videoId } = req.params;

      try {
        console.log('llamado route delete');
        const deletedMovieId = await videosService.deleteMovie({ videoId });

        res.status(200).json({
          data: deletedMovieId,
          message: 'video deleted',
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
