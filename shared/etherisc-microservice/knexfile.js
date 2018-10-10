const _ = require('lodash');


const prefix = _.last(process.env.npm_package_name.split('/'));

module.exports = {
  prefix,
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgresql',
    password: process.env.DB_PASS || 'postgresql',
    database: process.env.DB_DATABASE || 'postgresql',
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
            CREATE TRIGGER ${table}_updated
            BEFORE UPDATE ON ${table}
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated()
          `,
      down: table => `DROP TRIGGER ${table}_updated on ${table}`,
    },
  },
  functions: {
    update_updated: {
      up: () => `
        CREATE OR REPLACE FUNCTION update_updated()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated = now();
            RETURN NEW;  
        END;
        $$ language 'plpgsql';
      `,
      down: () => `
        DROP FUNCTION IF EXISTS update_updated RESTRICT;
      `,
    },
  },
};
