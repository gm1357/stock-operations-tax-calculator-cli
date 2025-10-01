import {
  INSUFFICIENT_STOCK_ERROR,
  OPERATION_TYPE,
  TAX_FREE_THRESHOLD,
  TAX_RATE,
} from './constants.js';
import { calculateWeightedAverage } from '../utils/math.js';

export function parseLedgers(lines) {
  return lines.map((line) => JSON.parse(line));
}

export function calculateManyLedgersTaxes(operationsLedgers) {
  return operationsLedgers.map((ledger) => calculateLedgerTaxes(ledger));
}

function calculateLedgerTaxes(operationsLedger) {
  const results = [];
  let weightedAveragePrice = 0;
  let stockQuantity = 0;
  let accumulatedLoss = 0;

  for (const operation of operationsLedger) {
    const {
      operation: operationType,
      quantity,
      'unit-cost': unitCost,
    } = operation;

    switch (operationType) {
      case OPERATION_TYPE.BUY: {
        weightedAveragePrice = calculatePriceWeightedAverage({
          currentStockQuantity: stockQuantity,
          previousWeightedAverage: weightedAveragePrice,
          boughtQuantity: quantity,
          currentUnitCost: unitCost,
        });
        stockQuantity += quantity;

        results.push({ tax: 0 });

        break;
      }

      case OPERATION_TYPE.SELL: {
        if (stockQuantity - quantity < 0) {
          results.push({ error: INSUFFICIENT_STOCK_ERROR });
          continue;
        }

        stockQuantity -= quantity;

        if (unitCost <= weightedAveragePrice) {
          const loss = (weightedAveragePrice - unitCost) * quantity;
          accumulatedLoss += loss;

          results.push({ tax: 0 });

          break;
        }

        if (unitCost * quantity <= TAX_FREE_THRESHOLD) {
          results.push({ tax: 0 });
          break;
        }

        const profit = (unitCost - weightedAveragePrice) * quantity;
        const profitAfterLossCompensation = Math.max(
          0,
          profit - accumulatedLoss,
        );
        accumulatedLoss = Math.max(0, accumulatedLoss - profit);
        const tax = profitAfterLossCompensation * TAX_RATE;
        results.push({ tax });

        break;
      }
      default:
        throw new Error(`Unknown operation type: ${operationType}`);
    }
  }

  return results;
}

function calculatePriceWeightedAverage({
  currentStockQuantity,
  previousWeightedAverage,
  boughtQuantity,
  currentUnitCost,
}) {
  return calculateWeightedAverage({
    weights: [currentStockQuantity, boughtQuantity],
    values: [previousWeightedAverage, currentUnitCost],
  });
}
