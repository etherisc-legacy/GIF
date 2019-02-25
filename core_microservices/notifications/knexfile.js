const { knexfile } = require('@etherisc/microservice');


module.exports = {
  ...knexfile,
  schema: knexfile.prefix,
  constants: {
    PRODUCT_SETTINGS_TABLE: 'product_settings',
  },
};
