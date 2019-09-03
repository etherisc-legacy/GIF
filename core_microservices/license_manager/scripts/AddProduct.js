const { bootstrap } = require('@etherisc/microservice');
const models = require('../models');

/**
 * External script to add Product records to License MS databse
 */
class AddProduct {
  /**
     * Constructor
     * @param {object} amqp
     * @param {object} config
     * @param {object} log
     * @param {object} db
     */
  constructor({
    config, log, db,
  }) {
    this.config = config;
    this.log = log;
    this.db = db;
    this.models = models(db);
  }

  /**
     * Run the script using application environment
     * @return {Promise<void>}
     */
  async bootstrap() {
    const { Product } = this.models;
    const productName = this.config.args[0];
    this.log.info(`Adding product "${productName}" to License Manager`);

    let shouldFail = 0;

    try {
      await Product.query().upsertGraph({
        name: productName,
      }, { insertMissing: true });
    } catch (error) {
      console.log(error.message);
      if (error.constraint !== 'products_name_unique') {
        shouldFail = 1;
      }
    } finally { process.exit(shouldFail); }
  }
}

bootstrap(AddProduct, {
  db: true,
  args: process.argv.slice(2),
});
