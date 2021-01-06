const Payment = require('./Payment');
const PaymentData = require('./PaymentData');


module.exports = (db) => {
  Payment.knex(db);
  PaymentData.knex(db);

  return {
    Payment,
    PaymentData,
  };
};
