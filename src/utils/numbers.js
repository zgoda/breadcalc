const AmountType = Object.freeze({
  TOTAL: 'total',
  PERCENT: 'percent',
});

function round(num, dp) {
  const multiplier = 10 ** dp;
  return Math.round((num + Number.EPSILON) * multiplier) / multiplier;
}

export { round, AmountType };
