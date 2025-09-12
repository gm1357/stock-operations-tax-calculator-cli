export function calculatePriceWeightedAverage({
  currentStockQuantity,
  previousWeightedAverage,
  boughtQuantity,
  currentUnitCost,
}) {
  const weightedAverage =
    (currentStockQuantity * previousWeightedAverage +
      boughtQuantity * currentUnitCost) /
    (currentStockQuantity + boughtQuantity);

  return roundToTwoDecimalPlaces(weightedAverage) || 0;
}

function roundToTwoDecimalPlaces(value) {
  return Math.round(value * 100) / 100;
}
