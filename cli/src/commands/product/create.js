const BaseCommand = require('../../lib/BaseCommand');

/**
 * Create product command
 */
class CreateProduct extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    const name = await this.cli.prompt('Product name');

    // E.g. response
    // const response = {
    //   data: {
    //     id: 1,
    //     password: 'FpEgkNTllW1z903qvvoA5UXL',
    //   },
    // };
    const response = await this.api.createProduct(name);

    const config = this.configuration;

    if (!config.products) {
      config.products = {};
    }

    config.products[name] = {
      id: response.data.id,
      amqpLogin: name,
      amqpPassword: response.data.password,
    };

    config.current = name;

    this.configure(config);

    this.log('Product created');
  }
}

CreateProduct.description = `Create new product
...
Create new product
`;

module.exports = CreateProduct;
