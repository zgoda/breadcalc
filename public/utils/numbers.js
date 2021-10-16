const AmountType = Object.freeze({
  TOTAL: 'total',
  PERCENT: 'percent',
});

/**
 * Round number to specified precision
 * @param {number} num number to round
 * @param {number} dp decimal places
 * @returns {number}
 */
function round(num, dp) {
  const multiplier = 10 ** dp;
  return Math.round((num + Number.EPSILON) * multiplier) / multiplier;
}

export { round, AmountType };
