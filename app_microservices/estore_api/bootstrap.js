const { bootstrap } = require('@etherisc/microservice');
const EStoreInsurance = require('./EStoreInsurance');


bootstrap(EStoreInsurance, {
  amqp: true,
  genericInsurance: true,
  httpDevPort: 3010,
});
