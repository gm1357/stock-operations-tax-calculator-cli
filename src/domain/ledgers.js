import { OPERATION_TYPE, TAX_FREE_THRESHOLD, TAX_RATE } from './constants.js';
import { calculatePriceWeightedAverage } from './capital-operations.js';

export function parseLedgers(lines) {
  return lines.map((line) => JSON.parse(line));
}

export function calculateManyLedgersTaxes(operationsLedgers) {
  return operationsLedgers.map((ledger) => calculateLedgerTaxes(ledger));
}

function calculateLedgerTaxes(operationsLedger) {
  const taxes = [];
  let weightedAveragePrice = 0;
  let stockQuantity = 0;
  let accumulatedLoss = 0;

  for (const operation of operationsLedger) {
    const {
      operation: operationType,
      quantity,
      'unit-cost': unitCost,
    } = operation;
    // Buy operation
    if (operationType === OPERATION_TYPE.BUY) {
      weightedAveragePrice = calculatePriceWeightedAverage({
        currentStockQuantity: stockQuantity,
        previousWeightedAverage: weightedAveragePrice,
        boughtQuantity: quantity,
        currentUnitCost: unitCost,
      });
      stockQuantity += quantity;
      taxes.push(0);
      continue;
    }

    // Sell operation
    stockQuantity -= quantity;

    if (unitCost <= weightedAveragePrice) {
      const loss = (weightedAveragePrice - unitCost) * quantity;
      accumulatedLoss += loss;
      taxes.push(0);
      continue;
    }

    if (unitCost * quantity <= TAX_FREE_THRESHOLD) {
      taxes.push(0);
      continue;
    }

    const profit = (unitCost - weightedAveragePrice) * quantity;
    const profitAfterLossCompensation = Math.max(0, profit - accumulatedLoss);
    accumulatedLoss = Math.max(0, accumulatedLoss - profit);
    taxes.push(profitAfterLossCompensation * TAX_RATE);
  }

  return taxes.map((tax) => ({ tax }));
}
