const boom = require('@hapi/boom');
const joi = require('@hapi/joi');

function validate(data, schema) {
  const { error } = joi.object(schema).validate(data); //en la const espero un {error} si existe al validar parametros...
  //const { error } = joi.valid (data, schema) //version anterior
  return error; //retorno ese error
}

function validationHandler(schema, check = 'body') {
  return function (req, res, next) {
    const error = validate(req[check], schema);
    error ? next(boom.badRequest(error)) : next(); //boom.badRequest(error) indica que los datos no son validos
  };
}
module.exports = validationHandler;
