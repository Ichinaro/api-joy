const { config } = require('../config');

function cacheResponse(res, seconds) {
  //permite que el cache no se active en modo desarrollo (dev)
  if (!config.dev) {
    res.set('Cache-Control', `public, max-age=${seconds}`); //cada determnado tiempo solicita una nueva res (routes/movies) que se guarda en cache y modifica la actual
  }
}

module.exports = cacheResponse; //no todas las rutas deben tener cache, solo en las que estamos requiriendo recursos

//verifica que el cache no aparesca en el navegador durane el modo desarrolo (dev)
//navegador (inspecionar elemento / network / movies / Response Headers)
