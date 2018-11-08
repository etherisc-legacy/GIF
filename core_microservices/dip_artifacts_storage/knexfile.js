const { knexfile } = require('@etherisc/microservice');


module.exports = {
  ...knexfile,
  migrations: {
    tableName: 'artifacts_storage_migrations',
  },
};
