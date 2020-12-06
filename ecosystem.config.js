/**
 * PM2 Environment file
 *
 *
 */

const { NODE_ENV } = process.env;

const env = {

  KUBERNETES_HTTP_PORT: 3000,

  API_PORT: {
    test: 4001,
    staging: 4001,
    production: 4000,
  },

  /**
   * Salt for Business ID generation
   */
  SALT: 'salt',

  /**
   * Ethereum Client ŝmicroservice
   * Event Listener microservice
   */
  // web3 provider
  WS_PROVIDER: {
    test: 'ws://localhost:8545', // sokol
    staging: 'ws://localhost:8545', // sokol
    production: 'ws://localhost:8545', // xdai mainnet
  },
  HTTP_PROVIDER: {
    test: 'http://localhost:8545', // sokol
    staging: 'http://localhost:8545', // sokol
    production: 'http://localhost:8545', // xdai mainnet
  },
  NETWORK_NAME: {
    test: 'development',
    staging: 'development',
    production: 'development',
  },

  // HDWallet Account
  MNEMONIC: {
    test: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
    staging: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
    production: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
  },
  ACCOUNT: {
    test: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
    staging: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
    production: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
  },

  /**
   * Notifications microservice
   */

  // SMTP Credentials for Notifications
  SMTP_USERNAME: {
    test: '',
    staging: 'https://',
    production: 'https://',
  },
  SMTP_PASSWORD: {
    test: '',
    staging: 'https://',
    production: 'https://',
  },
  SMTP_HOST: {
    test: '',
    staging: 'https://',
    production: 'https://',
  },
  SMTP_USE_SSL: {
    test: '',
    staging: 'https://',
    production: 'https://',
  },

  // Telegram Bot Token
  BOT_TOKEN: {
    test: '',
    staging: 'https://',
    production: 'https://',
  },

  /**
   * Fiat Payout Gateway microservice
   */

  TRANSFERWISE_SRC_CURRENCY: '',
  TRANSFERWISE_PROFILE_ID: '',
  TRANSFERWISE_API_URL: '',
  TRANSFERWISE_API_TOKEN: '',
  TRANSFERWISE_LOGIN: '',
  TRANSFERWISE_PASSWORD: '',

  /**
   * Fiat Payment Gateway microservice
   */

  STRIPE_SECRET_KEY: '',

  /**
   * License Manager microservice
   */

  // Rabbit MQ Credentials
  RABBIT_API_PORT: {
    test: '15674',
    staging: '15673',
    production: '15672',
  },
  RABBIT_ADMIN_USERNAME: 'admin',
  RABBIT_ADMIN_PASSWORD: 'guest',
  RABBIT_API_HOST: 'localhost',

  // JWT Token
  JWT_SECRET: 'secret',
  JWT_TOKEN_EXPIRATION_MINUTES: 360,

  /**
   * MinIO credentials
   */

  AWS_ENDPOINT: {
    test: 'http://localhost:9001',
    staging: 'http://localhost:9001',
    production: 'http://localhost:9000',
  },
  AWS_ACCESS_KEY: 'accesskey',
  AWS_SECRET_KEY: 'secretkey',

  /**
   * Rabbit MQ Credentials
   */
  AMQP_PORT: {
    test: '5674',
    staging: '5673',
    production: '5672',
  },
  AMQP_HOST: 'localhost',
  AMQP_USERNAME: 'platform',
  AMQP_PASSWORD: 'guest',
  AMQP_MODE: 'core',

  /**
   * Postgresql Credentials
   */
  POSTGRES_SERVICE_PORT: {
    test: '5434',
    staging: '5433',
    production: '5432',
  },
  POSTGRES_SERVICE_HOST: 'localhost',
  POSTGRES_DB: 'postgresql',
  POSTGRES_USER: 'postgresql',
  POSTGRES_PASSWORD: 'postgresql',

};

/**
 * Check if parameter is object
 * @param {{}} a
 * @returns {boolean|boolean}
 */
const isObject = a => (!!a) && (a.constructor === Object);

/**
 * Compute Environment variables
 * @param {string} environment
 * @returns {{}}
 */
const getEnv = (environment) => {
  const computedEnv = {};
  Object.keys(env).forEach((key) => {
    computedEnv[key] = isObject(env[key]) ? env[key][environment] : env[key];
  });
  return computedEnv;
};

// Uncomment unused microservices, e.g. fiat gateways
const services = [
  'ethereum_client',
  'event_listener',
  'event_logging',
  //  'fiat_payment_gateway',
  //  'fiat_payout_gateway',
  'license_manager',
  'notifications',
  'pdf_generator',
  'policy_storage',
];

const apps = services.map(service => ({
  name: service,
  script: 'bootstrap.js',
  watch: '.',
  cwd: `core_microservices/${service}`,
  env: getEnv(NODE_ENV),
  autorestart: false,
}));

module.exports = { apps };
