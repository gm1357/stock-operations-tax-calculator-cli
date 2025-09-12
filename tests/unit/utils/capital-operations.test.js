import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculatePriceWeightedAverage } from '../../../src/utils/capital-operations.js';

describe('calculatePriceWeightedAverage', () => {
  it('should calculate the correct weighted average price', () => {
    const result = calculatePriceWeightedAverage({
      currentStockQuantity: 5,
      previousWeightedAverage: 20,
      boughtQuantity: 5,
      currentUnitCost: 10,
    });
    assert.strictEqual(result, 15);
  });

  it('should handle decimal values correctly', () => {
    const result = calculatePriceWeightedAverage({
      currentStockQuantity: 3,
      previousWeightedAverage: 19.99,
      boughtQuantity: 7,
      currentUnitCost: 10.5,
    });
    assert.strictEqual(result, 13.35);
  });

  it('should handle zero current stock quantity', () => {
    const result = calculatePriceWeightedAverage({
      currentStockQuantity: 0,
      previousWeightedAverage: 20,
      boughtQuantity: 5,
      currentUnitCost: 10,
    });
    assert.strictEqual(result, 10);
  });

  it('should handle zero bought quantity', () => {
    const result = calculatePriceWeightedAverage({
      currentStockQuantity: 5,
      previousWeightedAverage: 20,
      boughtQuantity: 0,
      currentUnitCost: 10,
    });
    assert.strictEqual(result, 20);
  });

  it('should handle both quantities being zero', () => {
    const result = calculatePriceWeightedAverage({
      currentStockQuantity: 0,
      previousWeightedAverage: 20,
      boughtQuantity: 0,
      currentUnitCost: 10,
    });
    assert.strictEqual(result, 0);
  });

  it('should return 0 when all inputs are zero', () => {
    const result = calculatePriceWeightedAverage({
      currentStockQuantity: 0,
      previousWeightedAverage: 0,
      boughtQuantity: 0,
      currentUnitCost: 0,
    });
    assert.strictEqual(result, 0);
  });
});
