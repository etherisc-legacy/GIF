const Customer = require('./Customer');
const CustomerExtra = require('./CustomerExtra');
const Policy = require('./Policy');
const PolicyExtra = require('./PolicyExtra');
const Distributor = require('./Distributor');


module.exports = (db) => {
  Customer.knex(db);
  CustomerExtra.knex(db);
  Policy.knex(db);
  PolicyExtra.knex(db);
  Distributor.knex(db);

  return {
    Customer,
    CustomerExtra,
    Policy,
    PolicyExtra,
    Distributor,
  };
};
