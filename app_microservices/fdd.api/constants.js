const CURRENCIES = [
  { label: 'EUR', code: '&euro;' },
  { label: 'USD', code: '&dollar;' },
  { label: 'GBP', code: '&pound;' },
  { label: 'ETH', code: '&Xi;' },
];

const PAYMENT_TYPES = ['eth', 'eur', 'usd', 'gbp'];

const MAX_PAYOUTS = [1.1, 300, 350, 270];

const COUPONS = {
  d1conf: 15,
};

const MIN_DEPARTURE_LIM = 1512950400;

const MAX_DEPARTURE_LIM = 1544486400;

const MIN_TIME_BEFORE_DEPARTURE = 24 * 60 * 60;

module.exports = {
  CURRENCIES,
  PAYMENT_TYPES,
  MAX_PAYOUTS,
  COUPONS,
  MIN_DEPARTURE_LIM,
  MAX_DEPARTURE_LIM,
  MIN_TIME_BEFORE_DEPARTURE,
};
