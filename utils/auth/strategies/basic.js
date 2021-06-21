const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const UsersService = require('../../../services/users');

passport.use(
  new BasicStrategy(async function (email, password, cb) {
    const userService = new UsersService();
    try {
      console.log('confirmando email y devolvindo datos de user');
      const user = await userService.getUser({ email }); // toma como respuesta los datos de un usuario

      if (!user) {
        //si el usuario no existe retorna un unauthorized
        return cb(boom.unauthorized(), false); //el segundo parametro refiere al user con el valor false (no existe)
      }
      console.log('user-email confirmado');
      //compara si el password ingresado no coincide con el password del usuario obtenido
      if (!(await bcrypt.compare(password, user.password))) {
        //cuidado sin el await doy acceso a cualquiera sin validar password
        return cb(boom.unauthorized(), false);
      }
      console.log('password confirmada');
      delete user.password; //elimino el password del objeto obtenido en const user
      console.log(user);
      console.log('retornando user sin password');
      return cb(null, user);
    } catch (error) {
      return cb(error);
    }
  })
);
