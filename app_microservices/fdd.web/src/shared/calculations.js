import { MAX_PAYOUTS } from './constants';

import CustomConfig from './customConfig';


export const calculatePayouts = (stats) => (premium, currency) => {
  if (!premium || premium <= 0 || isNaN(Number(premium))) {
    return false;
  }

  const weightPattern = CustomConfig.payoutCalc.weightPattern || [0, 0, 0, 30, 50, 50];
  const maxPayouts = CustomConfig.payoutCalc.maxPayouts || MAX_PAYOUTS;
  const MAX_PAYOUT = maxPayouts[currency];

  const statistics = [
    stats.observations, stats.late15, stats.late30, stats.late45, stats.cancelled, stats.diverted,
  ];

  let weight = 0;

  for (let i = 1; i < 6; i++) {
    weight += weightPattern[i] * statistics[i] * 10000 / stats.observations;
  }

  if (weight === 0) {
    weight = 100000 / stats.observations;
  }

  weight = Math.floor(weight);

  let payoutOptions = {};

  for (let i = 0; i < 5; i++) {
    let payout = premium * weightPattern[i + 1] * 10000 / weight;

    if (payout > MAX_PAYOUT) payout = MAX_PAYOUT;

    payoutOptions[`p${i+1}`] = (Math.floor(payout * 100)/100).toFixed(2);
  }

  return payoutOptions;
};
