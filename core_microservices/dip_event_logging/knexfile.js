const knexfile = require('@etherisc/microservice/knexfile');


module.exports = {
  ...knexfile,
  migrations: {
    tableName: 'event_logging_migrations',
  },
};
