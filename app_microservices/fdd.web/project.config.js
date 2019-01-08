const DEMO = process.env.EDITION === 'demo';
const SUGGEST_DEMO = process.env.EDITION === 'suggest_demo';
const MAINNET = process.env.CHAIN === 'mainnet';
const USE_CUSTOMIZATION_CONFIG = true; // process.env.USE_CUSTOMIZATION_CONFIG === 'true';
let {
  FD_ADDRESS_RESOLVER_DEV='0xD6fe6b2A3733548Ca6dB41CA7F85268312dEcB2A',
  STRIPE_PKEY,
  CHAIN = 'ropsten',
} = process.env;

/**
 * @param {string} networkLabel
 * @return {string}
 */
const getNetworkId = (networkLabel) => {
  if (networkLabel === 'mainnet') return '1';
  if (networkLabel === 'ropsten') return '3';
  if (networkLabel === 'kovan') return '42';

  throw new Error('Unknown network label');
};

const config = {
  VENDORS: [
    'react',
    'react-dom',
    'history',
    'react-redux',
    'react-router-redux',
    'react-router-dom',
    'redux',
    'redux-saga',
    'redux-form',
    'classnames',
    'isomorphic-fetch',
    'moment',
    'redux-actions',
  ].filter(Boolean),
  copy: [
    { from: 'src/assets/lib', to: 'lib' },
    { from: 'src/assets/images/atlas.jpg', to: 'atlas.jpg' },
    { from: 'src/assets/favicon.png', to: 'favicon.png' },
    { from: 'src/version.json', to: 'version.json' },
  ],
  proxy: {
    '/api': 'http://localhost:3001',
  },
  constants: {
    // live - pk_live_wZdDLC58PnMKkOD9pbDzl8PA
    // test - pk_test_RJmIHkFvF328HmLXukZsjVsy
    STRIPE_PKEY: STRIPE_PKEY || (DEMO ? 'pk_test_G9CSTZTnASdZHyAlAGlstS6c' : 'pk_test_G9CSTZTnASdZHyAlAGlstS6c'),

    FD_ADDRESS_RESOLVER_DEV: FD_ADDRESS_RESOLVER_DEV
      || (MAINNET ? '0x63338bB37Bc3A0d55d2E9505F11E56c613b51494' : '0x47319C16FB4652203739a2747569E4c76ace2777'),

    ETH_DEFAULT_PROVIDER: `https://${CHAIN}.infura.io/1reQ7FJQ1zs0QGExhlZ8`,

    NETWORK: getNetworkId(CHAIN),
    ETHERSCAN: MAINNET ? 'https://etherscan.io' : `https://${CHAIN}.etherscan.io`,
    SELECT_FLIGHT_WITH_SCHEDULE: false,
    DEMO,
    SUGGEST_DEMO,
    MAINNET,
    USE_CUSTOMIZATION_CONFIG,
  },
};

export default config;

// implementation
