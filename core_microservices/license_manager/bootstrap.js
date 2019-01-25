const { bootstrap } = require('@etherisc/microservice');
const LicenseManager = require('./LicenseManager');


bootstrap(LicenseManager, {
  db: true,
  amqp: true,
});
