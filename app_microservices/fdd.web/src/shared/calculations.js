import { MAX_PAYOUTS } from './constants';

import CustomConfig from './customConfig';

const getPayout = (premium, reserved1, reserved2, weight, max) => pattern =>
  Math.min(Number(((premium * (1 - reserved1) * (1 - reserved2)) * pattern) / weight), max).toFixed(2);

export const calculatePayouts = (stats) => (premium, currency) => {
  if (!premium || premium <= 0 || isNaN(Number(premium))) {
    return false;
  }

  const d15 = stats.late15 / stats.observations;
  const d30 = stats.late30 / stats.observations;
  const d45 = stats.late45 / stats.observations;
  const can = stats.cancelled / stats.observations;
  const div = stats.diverted / stats.observations;

  const weightPattern = CustomConfig.payoutCalc.weightPattern || [10, 20, 30, 50, 50];

  const reserved1 = 0.02;
  const reserved2 = 0.01;

  let weight = (d15 * weightPattern[0]) +
    (d30 * weightPattern[1]) +
    (d45 * weightPattern[2]) +
    (div * weightPattern[3]) +
    (can * weightPattern[4]);

  if (weight === 0) {
    weight = 2;
  }

  const maxPayouts = CustomConfig.payoutCalc.maxPayouts || MAX_PAYOUTS;
  const payout = getPayout(premium, reserved1, reserved2, weight, maxPayouts[currency]);

  return {
    p1: payout(weightPattern[0]),
    p2: payout(weightPattern[1]),
    p3: payout(weightPattern[2]),
    p4: payout(weightPattern[3]),
    p5: payout(weightPattern[4]),
  };
};
