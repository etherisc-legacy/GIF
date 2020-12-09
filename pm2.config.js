/**
 * PM2 Environment file
 *
 *
 */

const { NODE_ENV } = process.env;

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
  name: `${NODE_ENV}-${service}`,
  script: 'bootstrap.js',
  watch: '.',
  cwd: `core_microservices/${service}`,
  autorestart: false,
}));

module.exports = { apps };
