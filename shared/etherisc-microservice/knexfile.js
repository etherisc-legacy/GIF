const _ = require('lodash');


const prefix = _.last((process.env.npm_package_name || '').split('/')).replace('dip_', '');

module.exports = {
  prefix,
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
    tableName: `${prefix}_migrations`,
  },
  triggers: {
    onUpdateTrigger: {
      up: table => `
            CREATE TRIGGER ${table.replace('.', '_')}_updated
            BEFORE UPDATE ON ${table}
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated()
          `,
      down: table => `DROP TRIGGER ${table.replace('.', '_')}_updated on ${table}`,
    },
  },
  functions: {
    schema: {
      up: () => `
        CREATE SCHEMA IF NOT EXISTS ${prefix}
      `,
      down: () => `
        DROP SCHEMA IF EXISTS ${prefix} CASCADE
      `,
    },
    update_updated: {
      up: () => `
        BEGIN;

        SELECT pg_advisory_xact_lock(1);
        
        CREATE OR REPLACE FUNCTION update_updated()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated = now();
            RETURN NEW;  
        END;
        $$ language 'plpgsql';
        
        COMMIT;
      `,
      down: () => `
        BEGIN;

        SELECT pg_advisory_xact_lock(1);
      
        DROP FUNCTION IF EXISTS update_updated RESTRICT;
        
        COMMIT;
      `,
    },
  },
};
