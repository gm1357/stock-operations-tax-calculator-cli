import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateWeightedAverage } from '../../../src/utils/math.js';

describe('calculateWeightedAverage', () => {
  it('should calculate the correct weighted average', () => {
    const result = calculateWeightedAverage({
      weights: [5, 5],
      values: [20, 10],
    });
    assert.strictEqual(result, 15);
  });

  it('should handle decimal values correctly', () => {
    const result = calculateWeightedAverage({
      weights: [3, 7],
      values: [19.99, 10.5],
    });
    assert.strictEqual(result, 13.35);
  });

  it('should handle first weight being zero', () => {
    const result = calculateWeightedAverage({
      weights: [0, 5],
      values: [20, 10],
    });
    assert.strictEqual(result, 10);
  });

  it('should handle last weight being zero', () => {
    const result = calculateWeightedAverage({
      weights: [5, 0],
      values: [20, 10],
    });
    assert.strictEqual(result, 20);
  });

  it('should handle both weights being zero', () => {
    const result = calculateWeightedAverage({
      weights: [0, 0],
      values: [20, 10],
    });
    assert.strictEqual(result, 0);
  });

  it('should return 0 when all inputs are zero', () => {
    const result = calculateWeightedAverage({
      weights: [0, 0],
      values: [0, 0],
    });
    assert.strictEqual(result, 0);
  });

  it('should calculate the correct weighted average for 3 weights and values', () => {
    const result = calculateWeightedAverage({
      weights: [2, 5, 3],
      values: [20, 10, 30],
    });
    assert.strictEqual(result, 18);
  });
});
