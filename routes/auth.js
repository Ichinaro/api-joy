const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const ApiKeysService = require('../services/apiKeys');
const UsersService = require('../services/users');
const { config } = require('../config');
//const { Router } = require('express');
//BASIC STRATEGY
require('../utils/auth/strategies/basic'); //Agrega todo el codigo del arhivo de esa ruta en este documento

function authApi(app) {
  //hace la funionalidad del router
  const router = express.Router();
  app.use('/api/auth', router);

  const apiKeysService = new ApiKeysService(); //linea 36
  const usersService = new UsersService();

  //router con metodo httt-post
  router.post('/sign-in', async function (req, res, next) {
    //apiKeyToken lo recibe del body
    console.log('recibiendo llave publica');
    const { apiKeyToken } = req.body; //se lo pasa al sing-in para determinar que clase de permisos va a firmar en el JWT
    if (!apiKeyToken) {
      //si no hay llave publica retorna...
      return next(boom.unauthorized('apikeyToken is required'));
    }
    console.log(apiKeyToken);
    console.log('llave publica confirmada');
    console.log('llamado basic api');
    //PRIMERO AUTHENTICO, LOGEO, TRAIGO SCOPES Y CONSTRUYO EL JWT

    //basic.js verifica que existe el usuario y que coincida el password, retornando un cb(user) "los datos de user en db" o un cb (error)
    passport.authenticate('basic', function (error, user) {
      try {
        if (error || !user) {
          return next(boom.unauthorized());
        }

        // req.login es un metodo que passport agrega en el req (passport.login)
        req.login(user, { session: false }, async function (error) {
          if (error) {
            next(error);
          }

          const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken }); //obtiene el token con los scopes
          if (!apiKey) {
            return next(boom.unauthorized());
          }

          const { _id: id, nombre, apellidos, email, curso } = user;
          const payload = {
            sub: id,
            apellidos,
            email,
            scopes: apiKey.scopes,
          };

          //construimos el token
          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: '240m', //el token expira en 15m
          });

          return res.status(200).json({ token, user: { id, nombre, email, apellidos, curso } });
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next); //closure para que el authenticate que contiene un custon cb funcione sin problemas
  });
  router.post(
    '/sign-up',
    //validationHandler(createUserSchema),
    async function (req, res, next) {
      const { body: user } = req;
      try {
        //codigo de tercero: verifica que no se repita un correo
        const userExists = await usersService.verifyUserExists(user);
        if (userExists) {
          res.send({
            message: 'user already exists',
          });
          return;
        }
        //codigo de tercero: verifica que no se repita un correo

        const createdUserId = await usersService.createUser({ user });
        res.status(201).json({
          data: createdUserId,
          message: 'user created',
        });
      } catch (error) {
        next(error);
      }
    }
  );
}

module.exports = authApi;
