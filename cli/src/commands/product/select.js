const BaseCommand = require('../../lib/BaseCommand');

/**
 * Select current product
 */
class SelectProduct extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    if (!this.configuration) {
      this.error(this.errorMessages.noConfiguration);
    }

    const { products } = this.configuration;

    if (!products || Object.keys(products).length === 0) {
      this.error(this.errorMessages.noProducts);
    }

    this.log('Available products:');
    Object.keys(products).map(product => this.log(`- ${product}`));
    const current = await this.cli.prompt('Select product');

    if (!products[current]) {
      this.error(this.errorMessages.noProduct);
    }

    this.configure({ ...this.configuration, current });

    this.log(`${current} selected`);
  }
}

SelectProduct.description = `Select current product
...
Select current product
`;

module.exports = SelectProduct;
