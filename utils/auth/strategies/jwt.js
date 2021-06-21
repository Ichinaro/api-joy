const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('@hapi/boom');

const UsersService = require('../../../services/users');
const { config } = require('../../../config/index');

//SE USA A PARTIR DE UN USUARIO YA LOGEADO
passport.use(
  new Strategy(
    {
      secretOrKey: config.authJwtSecret, //trae secret para desencriptar
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //extrae el jwt de header como un BearerToken
    },
    // jwtFromRequest es el lugar de donde se espera obtener el JWT.
    // BearerToken es un contenedor del token usado para no estar pasando el usuario y contraseña en cada req

    //recibe el payload del token Decodificado
    async function (tokenPayload, cb) {
      const usersService = new UsersService();
      try {
        console.log('Token=', tokenPayload);
        const user = await usersService.getUser({ email: tokenPayload.email });
        if (!user) {
          console.log('no existe usuario');
          return cb(boom.unauthorized(), false);
        }
        delete user.password;
        console.log(user);
        return cb(null, { ...user, scopes: tokenPayload.scopes });
      } catch (error) {
        return cb(error);
      }
    }
  )
);

// es posible que el takenPayload sea un objeto con la propiedad user{email} y scopes
