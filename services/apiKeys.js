const Mongolib = require('../lib/mongo');

class ApiKeysService {
  constructor() {
    this.collection = 'api-keys';
    this.mongoDB = new Mongolib();
  }

  async getApiKey({ token }) {
    const [apiKey] = await this.mongoDB.getAll(this.collection, { token });
    return apiKey; //retornas el token con los scopes
  }
}

module.exports = ApiKeysService;
