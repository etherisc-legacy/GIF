require('dotenv').config();
const { bootstrap } = require('@etherisc/microservice');
const mount = require('koa-mount');
const jwt = require('koa-jwt');
const LicenseManager = require('./LicenseManager');


const requiredEnv = ['JWT_SECRET', 'JWT_TOKEN_EXPIRATION_MINUTES', 'API_PORT',
  'RABBIT_ADMIN_USERNAME', 'RABBIT_ADMIN_PASSWORD', 'RABBIT_API_HOST', 'RABBIT_API_PORT'];

bootstrap(LicenseManager, {
  db: true,
  amqp: true,
  httpDevPort: process.env.API_PORT,
  httpAdditionalMiddleware: [
    mount('/api', jwt({ secret: process.env.JWT_SECRET }).unless({ path: [/^\/api\/users/] })),
  ],
  appName: process.env.APP_NAME,
  appVersion: process.env.APP_VERSION,
  requiredEnv,
});
