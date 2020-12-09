/**
 * GIF Configuration File
 *
 */
const globalVars = {

  /**
   * Kubernets port
   */
  KUBERNETES_HTTP_PORT: 3000,

  /**
   * API ports
   */
  API_PORT: {
    production: 4000,
    staging: 4001,
    test: 4001,
  },

  /**
   * Salt for Business ID generation
   */
  SALT: 'salt',

};
const web3Provider = {

  // web3 provider
  WS_PROVIDER: {
    production: 'ws://localhost:8545', // xdai mainnet
    staging: 'ws://localhost:8545', // sokol
    test: 'ws://localhost:8545', // sokol
  },
  HTTP_PROVIDER: {
    production: 'http://localhost:8545', // xdai mainnet
    staging: 'http://localhost:8545', // sokol
    test: 'http://localhost:8545', // sokol
  },
  NETWORK_NAME: {
    production: 'development',
    staging: 'development',
    test: 'development',
  },

};
const hdWallet = {
  // HDWallet Account
  MNEMONIC: {
    production: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
    staging: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
    test: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
  },
  ACCOUNT: {
    production: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
    staging: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
    test: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
  },

};
const smtpCredentials = {

  /**
   * Notifications microservice
   */

  // SMTP Credentials for Notifications
  SMTP_USERNAME: {
    production: 'https://',
    staging: 'https://',
    test: '',
  },
  SMTP_PASSWORD: {
    production: 'https://',
    staging: 'https://',
    test: '',
  },
  SMTP_HOST: {
    production: 'https://',
    staging: 'https://',
    test: '',
  },
  SMTP_USE_SSL: {
    production: 'https://',
    staging: 'https://',
    test: '',
  },

};
const telegramBot = {

  // Telegram Bot Token
  BOT_TOKEN: {
    production: 'https://',
    staging: 'https://',
    test: '',
  },

};
const transferwiseCredentials = {

  /**
   * Fiat Payout Gateway microservice
   */

  TRANSFERWISE_SRC_CURRENCY: '',
  TRANSFERWISE_PROFILE_ID: '',
  TRANSFERWISE_API_URL: '',
  TRANSFERWISE_API_TOKEN: '',
  TRANSFERWISE_LOGIN: '',
  TRANSFERWISE_PASSWORD: '',

};
const stripeCredentials = {

  /**
   * Fiat Payment Gateway microservice
   */

  STRIPE_SECRET_KEY: '',

};
const rabbitMQ = {

  /**
   * License Manager microservice
   */

  // Rabbit MQ Credentials
  RABBIT_API_PORT: {
    production: 15672,
    staging: 15673,
    test: 15674,
  },
  RABBIT_ADMIN_USERNAME: 'admin',
  RABBIT_ADMIN_PASSWORD: 'guest',
  RABBIT_API_HOST: 'localhost',

  AMQP_PORT: {
    production: 5672,
    staging: 5673,
    test: 5674,
  },
  AMQP_HOST: 'localhost',
  AMQP_USERNAME: 'platform',
  AMQP_PASSWORD: 'guest',
  AMQP_MODE: 'core',


};
const dockerRabbitMQ = {

  RABBITMQ_IMAGE: 'rabbitmq:3.7.7',
  RABBITMQ_PORT: {
    production: 5672,
    staging: 5673,
    test: 5674
  },
  RABBITMQ_ADMIN_PORT: {
    production: 15672,
    staging: 15673,
    test: 15674,
  },

};
const jwtToken = {

  // JWT Token
  JWT_SECRET: 'secret',
  JWT_TOKEN_EXPIRATION_MINUTES: 360,

};
const minIO = {

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

};

const postgresql = {
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
const dockerGanache = {

  GANACHE_IMAGE: 'trufflesuite/ganache-cli',
  GANACHE_PORT: 8545,
  GANACHE_MNEMONIC: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
  GANACHE_NETWORK_ID: 7777,

  ETHEREUM_BRIDGE_IMAGE: 'cryptomental/ethereum-bridge',

};
const dockerPostgresql = {

  POSTGRESQL_IMAGE: 'postgres:10.5',
  POSTGRESQL_PORT: {
    production: 5432,
    staging: 5433,
    test: 5434,
  },
};


const dockerMinIO = {

  MINIO_IMAGE: 'minio/minio',
  MINIO_ACCESS_KEY: 'accesskey',
  MINIO_SECRET_KEY: 'secretkey',
  MINIO_PORT: {
    production: 9000,
    staging: 9001,
    test: 9001
  },

};


module.exports = {

  envFiles: [
    {
      name:'ethereum_client',
      path: './core_microservices/ethereum_client',
      environments: ['test', 'staging', 'production'],
      vars: {
        globalVars,
        web3Provider,
        postgresql,
        rabbitMQ,
        minIO,
        hdWallet,
      },
    },
    {
      name:'event_listener',
      path: './core_microservices/event_listener',
      environments: ['test', 'staging', 'production'],
      vars: {
        globalVars,
        web3Provider,
        postgresql,
        rabbitMQ,
        minIO,
      },
    },
    {
      name:'event_logging',
      path: './core_microservices/event_logging',
      environments: ['test', 'staging', 'production'],
      vars: {
        globalVars,
        postgresql,
        rabbitMQ,
        minIO,
      },
    },
    {
      name:'fiat_payment_gateway',
      path: './core_microservices/fiat_payment_gateway',
      environments: ['test', 'staging', 'production'],
      vars: {
        globalVars,
        postgresql,
        rabbitMQ,
        minIO,
        stripeCredentials,
      },
    },
    {
      name:'fiat_payout_gateway',
      path: './core_microservices/fiat_payout_gateway',
      environments: ['test', 'staging', 'production'],
      vars: {
        globalVars,
        postgresql,
        rabbitMQ,
        minIO,
        transferwiseCredentials,
      },
    },
    {
      name:'license_manager',
      path: './core_microservices/license_manager',
      environments: ['test', 'staging', 'production'],
      vars: {
        globalVars,
        web3Provider,
        postgresql,
        rabbitMQ,
        minIO,
        stripeCredentials,
        jwtToken,
      },
    },
    {
      name:'notifications',
      path: './core_microservices/notifications',
      environments: ['test', 'staging', 'production'],
      vars: {
        globalVars,
        postgresql,
        rabbitMQ,
        minIO,
        smtpCredentials,
        telegramBot,
      },
    },
    {
      name:'docker_containers',
      path: './services/compose',
      environments: ['test', 'staging', 'production'],
      vars: {
        globalVars,
        postgresql,
        rabbitMQ,
        minIO,
        dockerPostgresql,
        dockerRabbitMQ,
        dockerMinIO,
      },
    },
    {
      name:'docker_ganache',
      path: './services/compose',
      environments: ['ganache'],
      vars: {
        dockerGanache,
      },
    },

  ],

}
