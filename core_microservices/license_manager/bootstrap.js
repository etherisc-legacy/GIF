require('dotenv').config({ path: '../.env' });
const { bootstrap } = require('@etherisc/microservice');

const mount = require('koa-mount');
const jwt = require('koa-jwt');
const LicenseManager = require('./LicenseManager');


const JWT_SECRET = process.env.JWT_SECRET || 'secret';

bootstrap(LicenseManager, {
  db: true,
  amqp: true,
  httpDevPort: 4001,
  httpAdditionalMiddleware: [
    mount('/api', jwt({ secret: JWT_SECRET }).unless({ path: [/^\/api\/users/] })),
  ],
  jwt_secret: JWT_SECRET,
});
