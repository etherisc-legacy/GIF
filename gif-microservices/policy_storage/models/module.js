const Customer = require('./Customer');
const CustomerExtra = require('./CustomerExtra');
const Policy = require('./Policy');
const PolicyExtra = require('./PolicyExtra');
const Distributor = require('./Distributor');
const Metadata = require('./Metadata');
const MetadataExtra = require('./MetadataExtra');
const Applications = require('./Applications');
const ApplicationsExtra = require('./ApplicationsExtra');
const Policies = require('./Policies');
const PoliciesExtra = require('./PoliciesExtra');
const Claims = require('./Claims');
const ClaimsExtra = require('./ClaimsExtra');
const Payouts = require('./Payouts');
const PayoutsExtra = require('./PayoutsExtra');
const Contracts = require('./Contracts');
const Changes = require('./Changes');
const Products = require('./Products');


module.exports = (db) => {
  Customer.knex(db);
  CustomerExtra.knex(db);
  Policy.knex(db);
  PolicyExtra.knex(db);
  Distributor.knex(db);
  Metadata.knex(db);
  MetadataExtra.knex(db);
  Applications.knex(db);
  ApplicationsExtra.knex(db);
  Policies.knex(db);
  PoliciesExtra.knex(db);
  Claims.knex(db);
  ClaimsExtra.knex(db);
  Payouts.knex(db);
  PayoutsExtra.knex(db);
  Contracts.knex(db);
  Changes.knex(db);
  Products.knex(db);

  return {
    Customer,
    CustomerExtra,
    Policy,
    PolicyExtra,
    Distributor,
    Metadata,
    MetadataExtra,
    Applications,
    ApplicationsExtra,
    Policies,
    PoliciesExtra,
    Claims,
    ClaimsExtra,
    Payouts,
    PayoutsExtra,
    Contracts,
    Changes,
    Products,
  };
};
