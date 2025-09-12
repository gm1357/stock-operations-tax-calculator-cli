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

    let tax = 0;

    switch (operationType) {
      case OPERATION_TYPE.BUY: {
        weightedAveragePrice = calculatePriceWeightedAverage({
          currentStockQuantity: stockQuantity,
          previousWeightedAverage: weightedAveragePrice,
          boughtQuantity: quantity,
          currentUnitCost: unitCost,
        });
        stockQuantity += quantity;
        break;
      }

      case OPERATION_TYPE.SELL: {
        stockQuantity -= quantity;

        if (unitCost <= weightedAveragePrice) {
          const loss = (weightedAveragePrice - unitCost) * quantity;
          accumulatedLoss += loss;
          break;
        }

        if (unitCost * quantity <= TAX_FREE_THRESHOLD) {
          break;
        }

        const profit = (unitCost - weightedAveragePrice) * quantity;
        const profitAfterLossCompensation = Math.max(
          0,
          profit - accumulatedLoss,
        );
        accumulatedLoss = Math.max(0, accumulatedLoss - profit);
        tax = profitAfterLossCompensation * TAX_RATE;

        break;
      }
      default:
        throw new Error(`Unknown operation type: ${operationType}`);
    }

    taxes.push(tax);
  }

  return taxes.map((tax) => ({ tax }));
}
