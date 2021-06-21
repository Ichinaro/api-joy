const MongoLib = require('../lib/mongo');

class MoviesService {
  constructor() {
    this.collection = 'articulos';
    this.mongoDB = new MongoLib();
  }

  async getMovies({ tags }) {
    const query = tags && { tags: { $in: tags } };
    const movies = await this.mongoDB.getAll(this.collection, query);
    return movies || [];
  }

  async getMovie({ articuloId }) {
    const movie = await this.mongoDB.get(this.collection, articuloId);
    return movie || {};
  }

  async createMovie({ movie }) {
    const createMovieId = await this.mongoDB.create(this.collection, movie);
    return createMovieId;
  }

  async updateMovie({ articuloId, movie } = {}) {
    const updatedMovieId = await this.mongoDB.update(
      this.collection,
      articuloId,
      movie
    );
    return updatedMovieId;
  }

  async deleteMovie({ articuloId }) {
    const deletedMovieId = await this.mongoDB.delete(this.collection, articuloId);
    return deletedMovieId;
  }
}

module.exports = MoviesService;
