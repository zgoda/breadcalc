const AmountType = Object.freeze({
  TOTAL: 'total',
  PERCENT: 'percent',
});

/**
 * Round number to specified precision
 * @param {Number} num number to round
 * @param {Number} dp decimal places
 * @returns Number
 */
function round(num, dp) {
  const multiplier = 10 ** dp;
  return Math.round((num + Number.EPSILON) * multiplier) / multiplier;
}

export { round, AmountType };
