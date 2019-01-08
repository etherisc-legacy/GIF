const { bootstrap } = require('@etherisc/microservice');
const FddApi = require('./FddApi');


bootstrap(FddApi, {
  httpDevPort: 3001,
  genericInsurance: true,
  db: true,
  router: true,
  amqp: true,
  log: true,
});
