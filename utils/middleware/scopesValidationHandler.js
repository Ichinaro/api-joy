const boom = require('@hapi/boom');

function scopesValidationHandler(allowedScopes) {
  return function (req, res, next) {
    if (!req.user || (req.user && !req.user.scopes)) {
      next(boom.unauthorized('Missing scopes'));
    }

    //declara si el scope del user se incluye en el scope solicitado de la route con un true o false
    const hasAccess = allowedScopes
      .map((allowedScope) => req.user.scopes.includes(allowedScope))
      .find((allowed) => Boolean(allowed)); //regresa un true o false

    if (hasAccess) {
      next(); //si tiene acceso sigue con otro middleware
    } else {
      next(boom.unauthorized('Insufficient scopes'));
    }
  };
}

module.exports = scopesValidationHandler;
