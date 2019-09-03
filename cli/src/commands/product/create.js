const _ = require('lodash');
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
    if (!this.configuration) {
      this.error(this.errorMessages.noConfiguration);
    }

    const name = await this.cli.prompt('Product name');

    // E.g. response
    // const response = {
    //   data: {
    //     id: 1,
    //     password: 'FpEgkNTllW1z903qvvoA5UXL',
    //   },
    // };

    const response = await this.api.createProduct(name)
      .catch((error) => {
        if (error.response.data && error.response.data.error) {
          const e = error.response.data.error;

          if (_.isString(e)) {
            this.error(e);
          }

          if (_.isArray(e)) {
            e.forEach((el) => {
              if (el.keyword && this.errorMessages[el.keyword]) {
                this.log('Error:', this.errorMessages[el.keyword]);
              } else {
                this.log('Error:', el);
              }
            });
          }
        }
      });

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
