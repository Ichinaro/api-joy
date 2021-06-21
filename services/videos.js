const MongoLib = require('../lib/mongo');

class MoviesService {
  constructor() {
    this.collection = 'videos';
    this.mongoDB = new MongoLib();
  }

  async getMovies({ tags }) {
    const query = tags && { tags: { $in: tags } };
    const movies = await this.mongoDB.getAll(this.collection, query);
    return movies || [];
  }

  async getMovie({ videoId }) {
    const movie = await this.mongoDB.get(this.collection, videoId);
    return movie || {};
  }

  async createMovie({ movie }) {
    const createMovieId = await this.mongoDB.create(this.collection, movie);
    return createMovieId;
  }

  async updateMovie({ videoId, movie } = {}) {
    const updatedMovieId = await this.mongoDB.update(
      this.collection,
      videoId,
      movie
    );
    return updatedMovieId;
  }

  async deleteMovie({ videoId }) {
    const deletedMovieId = await this.mongoDB.delete(this.collection, videoId);
    return deletedMovieId;
  }
}

module.exports = MoviesService;
