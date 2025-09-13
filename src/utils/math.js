export function calculateWeightedAverage({ weights, values }) {
  if (weights.length !== values.length || weights.length === 0) {
    throw new Error(
      'Weights and values arrays must have the same non-zero length',
    );
  }

  const totalWeight = weights.reduce((acc, w) => acc + w, 0);
  if (totalWeight === 0) {
    return 0;
  }

  const weightedAverage =
    values.reduce((acc, value, i) => acc + value * weights[i], 0) / totalWeight;

  return roundToTwoDecimalPlaces(weightedAverage) || 0;
}

function roundToTwoDecimalPlaces(value) {
  return Math.round(value * 100) / 100;
}
