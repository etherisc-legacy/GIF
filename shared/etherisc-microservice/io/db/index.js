const Knex = require('knex');

/**
 * Database
 */
class Database {
  /**
   * Constructor
   * @param {Knexfile} options
   */
  constructor(options) {
    this.options = options;

    this._connection = null;
  }

  /**
   * Create database connection
   * @return {Knex}
   */
  createConnection() {
    this._connection = Knex(this.options);

    return this._connection;
  }

  /**
   * Start module
   * @return {Promise<void>}
   */
  async bootstrap() {
    await this.createConnection();

    await this._connection.raw('select 1+1 as result').catch((e) => {
      const error = e;
      error.exit = 1;

      throw error;
    });
  }

  /**
   * Shutdown module
   */
  shutdown() {
    if (this._connection) {
      this._connection.destroy();
    }
  }
}

module.exports = Database;
