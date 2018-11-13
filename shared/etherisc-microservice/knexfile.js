const _ = require('lodash');


const schema = _.last((process.env.npm_package_name || '').split('/'));

module.exports = {
  schema,
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_SERVICE_HOST || 'localhost',
    port: process.env.POSTGRES_SERVICE_PORT || (process.env.CI || (process.env.NODE_ENV === 'test') ? 5432 : 5433),
    user: process.env.POSTGRES_USER || 'postgresql',
    password: process.env.POSTGRES_PASSWORD || 'postgresql',
    database: process.env.POSTGRES_DB || 'postgresql',
  },
  pool: {
    min: 0,
    max: 5,
  },
  migrations: {
    schemaName: schema,
  },
  triggers: {
    onUpdateTrigger: {
      up: table => `
            CREATE TRIGGER ${table}_updated
            BEFORE UPDATE ON ${schema}.${table}
            FOR EACH ROW
            EXECUTE PROCEDURE ${schema}.update_updated()
          `,
      down: table => `DROP TRIGGER ${table}_updated on ${schema}.${table}`,
    },
  },
  functions: {
    update_updated: {
      up: () => `
        CREATE OR REPLACE FUNCTION ${schema}.update_updated()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated = now();
            RETURN NEW;  
        END;
        $$ language 'plpgsql';
      `,
      down: () => `
        DROP FUNCTION IF EXISTS ${schema}.update_updated RESTRICT;
      `,
    },
  },
};
