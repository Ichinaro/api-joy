const MongoLib = require('../lib/mongo');

class MoviesService {
  constructor() {
    this.collection = 'tareas';
    this.mongoDB = new MongoLib();
  }

  async getMovies({ tags }) {
    const query = tags && { tags: { $in: tags } };
    const movies = await this.mongoDB.getAll(this.collection, query);
    return movies || [];
  }

  async getMovie({ tareaId }) {
    const movie = await this.mongoDB.get(this.collection, tareaId);
    return movie || {};
  }

  async createMovie({ movie }) {
    const createMovieId = await this.mongoDB.create(this.collection, movie);
    return createMovieId;
  }

  async updateMovie({ tareaId, movie } = {}) {
    const updatedMovieId = await this.mongoDB.update(
      this.collection,
      tareaId,
      movie
    );
    return updatedMovieId;
  }

  async deleteMovie({ tareaId }) {
    const deletedMovieId = await this.mongoDB.delete(this.collection, tareaId);
    return deletedMovieId;
  }
}

module.exports = MoviesService;
