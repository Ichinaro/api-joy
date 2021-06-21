const moviesMock = [
  {
    categoria: 'Deportes',
    titulo: 'Deportes',
    subTitulo: '1',
    fecha: '2021-02-26',
    descripcion: '',
    url:
      'https://www.tonica.la/__export/1595702332011/sites/debate/img/2020/07/25/rick-and-morty-escritores-trabajan-en-la-temporada-6.jpg_1902800913.jpg',
    id: 9,
  },
  {
    categoria: 'Deportes',
    titulo: 'Deportes',
    subTitulo: '1',
    fecha: '2021-02-26',
    descripcion: '',
    url:
      'https://www.tonica.la/__export/1595702332011/sites/debate/img/2020/07/25/rick-and-morty-escritores-trabajan-en-la-temporada-6.jpg_1902800913.jpg',
    id: 10,
  },
  {
    categoria: 'Deportes',
    titulo: 'Deportes',
    subTitulo: '1',
    fecha: '2021-02-26',
    descripcion: '',
    url:
      'https://www.tonica.la/__export/1595702332011/sites/debate/img/2020/07/25/rick-and-morty-escritores-trabajan-en-la-temporada-6.jpg_1902800913.jpg',
    id: 11,
  },
  {
    categoria: 'Internacional',
    titulo: 'Internacional',
    subTitulo: '1',
    fecha: '2021-02-26',
    descripcion: '',
    url:
      'https://www.tonica.la/__export/1595702332011/sites/debate/img/2020/07/25/rick-and-morty-escritores-trabajan-en-la-temporada-6.jpg_1902800913.jpg',
    id: 8,
  },
  {
    categoria: 'Deportes',
    titulo: 'Deportes',
    subTitulo: '1',
    fecha: '2021-02-26',
    descripcion: '',
    url:
      'https://www.tonica.la/__export/1595702332011/sites/debate/img/2020/07/25/rick-and-morty-escritores-trabajan-en-la-temporada-6.jpg_1902800913.jpg',
    id: 7,
  },
  {
    categoria: 'Nacional',
    titulo: 'Nacional',
    subTitulo: '1',
    fecha: '2021-02-26',
    descripcion: '',
    url:
      'https://www.tonica.la/__export/1595702332011/sites/debate/img/2020/07/25/rick-and-morty-escritores-trabajan-en-la-temporada-6.jpg_1902800913.jpg',
    id: 6,
  },
  {
    categoria: 'Local',
    titulo: 'Local',
    subTitulo: '1',
    fecha: '2021-02-26',
    descripcion: '',
    url:
      'https://www.tonica.la/__export/1595702332011/sites/debate/img/2020/07/25/rick-and-morty-escritores-trabajan-en-la-temporada-6.jpg_1902800913.jpg',
    id: 1,
  },
  {
    categoria: 'Local',
    titulo: '2',
    subTitulo: '2',
    fecha: '2021-02-25',
    descripcion: '',
    url:
      'https://image.freepik.com/vector-gratis/icono-logotipo-calavera-peligro_43623-516.jpg',
    id: 2,
  },
  {
    categoria: 'Local',
    titulo: '3',
    subTitulo: '3',
    fecha: '2021-02-20',
    descripcion: '3',
    url:
      'https://image.freepik.com/vector-gratis/icono-logotipo-calavera-peligro_43623-516.jpg',
    id: 3,
  },
  {
    categoria: 'Local',
    titulo: '4',
    subTitulo: '4',
    fecha: '2021-02-19',
    descripcion: '4',
    url:
      'https://ae01.alicdn.com/kf/H61fa3623b3cb4f37b7c6430f6f1d2e4eY/Patineta-de-pl-stico-Mini-Cruiser-tabla-larga-patinetas-completas-de-peces-para-principiantes-tabla-de.jpg_q50.jpg',
    id: 4,
  },
  {
    categoria: 'Local',
    titulo: 'Local',
    subTitulo: '5',
    fecha: '2021-02-17',
    descripcion: '5',
    url:
      'https://img.freepik.com/vector-gratis/patineta-sobre-fondo-azul-pastel_222057-35.jpg?size=626&ext=jpg',
    id: 5,
  },
  {
    categoria: 'Local',
    titulo: 'Local',
    subTitulo: 'local',
    fecha: '2021-02-19',
    descripcion: '',
    url:
      'https://www.tonica.la/__export/1595702332011/sites/debate/img/2020/07/25/rick-and-morty-escritores-trabajan-en-la-temporada-6.jpg_1902800913.jpg',
    id: 12,
  },
];

function filteredMoviesMock(tag) {
  return moviesMock.filter((movie) => movie.tags.includes(tag)); //filtra cada una de las peliculas guardadas en esta ruta con la pelicula que contenga el tag que incluimos
}

class MoviesServiceMock {
  async getMovies() {
    return Promise.resolve(moviesMock); //retorna todas las peliculas
  }
  async createMovie() {
    return Promise.resolve(moviesMock[0]); //retorna la primera pelicula
  }
}

module.exports = {
  moviesMock,
  filteredMoviesMock,
  MoviesServiceMock,
};
