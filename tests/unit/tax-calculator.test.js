import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateManyLedgersTaxes } from '../../src/tax-calculator.js';

describe('calculateManyLedgersTaxes', () => {
  it('should return no taxes for empty ledgers', () => {
    const ledgers = [];
    const expectedTaxes = [];

    const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

    assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
  });

  it('should return 0 taxes for buy operations only', () => {
    const ledgers = [
      [
        { operation: 'buy', 'unit-cost': 10, quantity: 100 },
        { operation: 'buy', 'unit-cost': 15, quantity: 50 },
      ],
    ];
    const expectedTaxes = [[{ tax: 0 }, { tax: 0 }]];

    const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

    assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
  });

  it('should return 0 tax for sell operations below the threshold', () => {
    const ledgers = [
      [
        { operation: 'buy', 'unit-cost': 10, quantity: 100 },
        { operation: 'sell', 'unit-cost': 15, quantity: 50 },
      ],
    ];
    const expectedTaxes = [[{ tax: 0 }, { tax: 0 }]];

    const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

    assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
  });

  it('should return 0 tax for sell operations equal to the threshold', () => {
    const ledgers = [
      [
        { operation: 'buy', 'unit-cost': 10, quantity: 1000 },
        { operation: 'sell', 'unit-cost': 20, quantity: 1000 },
      ],
    ];
    const expectedTaxes = [[{ tax: 0 }, { tax: 0 }]];

    const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

    assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
  });

  it('should return correct tax for sell operations above the threshold', () => {
    const ledgers = [
      [
        { operation: 'buy', 'unit-cost': 10, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 20, quantity: 5000 },
      ],
    ];
    const expectedTaxes = [[{ tax: 0 }, { tax: 10000 }]];

    const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

    assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
  });

  it('should return 0 taxes for losses', () => {
    const ledgers = [
      [
        { operation: 'buy', 'unit-cost': 10, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 9, quantity: 5000 },
      ],
    ];
    const expectedTaxes = [[{ tax: 0 }, { tax: 0 }]];

    const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

    assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
  });

  it('should return correct tax for multiple sell operations with mixed results', () => {
    const ledgers = [
      [
        { operation: 'buy', 'unit-cost': 10, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 5, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 20, quantity: 3000 },
      ],
    ];
    const expectedTaxes = [[{ tax: 0 }, { tax: 0 }, { tax: 1000 }]];

    const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

    assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
  });

  it('should calculate taxes correctly for Case #1', () => {
    const ledgers = [
      [
        { operation: 'buy', 'unit-cost': 10, quantity: 100 },
        { operation: 'sell', 'unit-cost': 15, quantity: 50 },
        { operation: 'sell', 'unit-cost': 15, quantity: 50 },
      ],
    ];
    const expectedTaxes = [[{ tax: 0 }, { tax: 0 }, { tax: 0 }]];

    const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

    assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
  });

  it('should calculate taxes correctly for Case #2', () => {
    const ledgers = [
      [
        { operation: 'buy', 'unit-cost': 10, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 20, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 5, quantity: 5000 },
      ],
    ];
    const expectedTaxes = [[{ tax: 0 }, { tax: 10000 }, { tax: 0 }]];

    const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

    assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
  });

  it('should calculate taxes correctly for Case #1 + Case #2', () => {
    const ledgers = [
      [
        { operation: 'buy', 'unit-cost': 10, quantity: 100 },
        { operation: 'sell', 'unit-cost': 15, quantity: 50 },
        { operation: 'sell', 'unit-cost': 15, quantity: 50 },
      ],
      [
        { operation: 'buy', 'unit-cost': 10, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 20, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 5, quantity: 5000 },
      ],
    ];
    const expectedTaxes = [
      [{ tax: 0 }, { tax: 0 }, { tax: 0 }],
      [{ tax: 0 }, { tax: 10000 }, { tax: 0 }],
    ];

    const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

    assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
  });

  it('should calculate taxes correctly for Case #3', () => {
    const ledgers = [
      [
        { operation: 'buy', 'unit-cost': 10, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 5, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 20, quantity: 3000 },
      ],
    ];
    const expectedTaxes = [[{ tax: 0 }, { tax: 0 }, { tax: 1000 }]];

    const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

    assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
  });

  it('should calculate taxes correctly for Case #4', () => {
    const ledgers = [
      [
        { operation: 'buy', 'unit-cost': 10, quantity: 10000 },
        { operation: 'buy', 'unit-cost': 25, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 15, quantity: 10000 },
      ],
    ];
    const expectedTaxes = [[{ tax: 0 }, { tax: 0 }, { tax: 0 }]];

    const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

    assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
  });

  it('should calculate taxes correctly for Case #5', () => {
    const ledgers = [
      [
        { operation: 'buy', 'unit-cost': 10, quantity: 10000 },
        { operation: 'buy', 'unit-cost': 25, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 15, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 25, quantity: 5000 },
      ],
    ];
    const expectedTaxes = [
      [{ tax: 0 }, { tax: 0 }, { tax: 0 }, { tax: 10000 }],
    ];

    const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

    assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
  });

  it('should calculate taxes correctly for Case #6', () => {
    const ledgers = [
      [
        { operation: 'buy', 'unit-cost': 10, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 2, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 20, quantity: 2000 },
        { operation: 'sell', 'unit-cost': 20, quantity: 2000 },
        { operation: 'sell', 'unit-cost': 25, quantity: 1000 },
      ],
    ];
    const expectedTaxes = [
      [{ tax: 0 }, { tax: 0 }, { tax: 0 }, { tax: 0 }, { tax: 3000 }],
    ];

    const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

    assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
  });

  it('should calculate taxes correctly for Case #7', () => {
    const ledgers = [
      [
        { operation: 'buy', 'unit-cost': 10, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 2, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 20, quantity: 2000 },
        { operation: 'sell', 'unit-cost': 20, quantity: 2000 },
        { operation: 'sell', 'unit-cost': 25, quantity: 1000 },
        { operation: 'buy', 'unit-cost': 20, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 15, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 30, quantity: 4350 },
        { operation: 'sell', 'unit-cost': 30, quantity: 650 },
      ],
    ];
    const expectedTaxes = [
      [
        { tax: 0 },
        { tax: 0 },
        { tax: 0 },
        { tax: 0 },
        { tax: 3000 },
        { tax: 0 },
        { tax: 0 },
        { tax: 3700 },
        { tax: 0 },
      ],
    ];

    const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

    assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
  });

  it('should calculate taxes correctly for Case #8', () => {
    const ledgers = [
      [
        { operation: 'buy', 'unit-cost': 10, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 50, quantity: 10000 },
        { operation: 'buy', 'unit-cost': 20, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 50, quantity: 10000 },
      ],
    ];
    const expectedTaxes = [
      [{ tax: 0 }, { tax: 80000 }, { tax: 0 }, { tax: 60000 }],
    ];

    const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

    assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
  });

  it('should calculate taxes correctly for Case #9', () => {
    const ledgers = [
      [
        { operation: 'buy', 'unit-cost': 5000, quantity: 10 },
        { operation: 'sell', 'unit-cost': 4000, quantity: 5 },
        { operation: 'buy', 'unit-cost': 15000, quantity: 5 },
        { operation: 'buy', 'unit-cost': 4000, quantity: 2 },
        { operation: 'buy', 'unit-cost': 23000, quantity: 2 },
        { operation: 'sell', 'unit-cost': 20000, quantity: 1 },
        { operation: 'sell', 'unit-cost': 12000, quantity: 10 },
        { operation: 'sell', 'unit-cost': 15000, quantity: 3 },
      ],
    ];
    const expectedTaxes = [
      [
        { tax: 0 },
        { tax: 0 },
        { tax: 0 },
        { tax: 0 },
        { tax: 0 },
        { tax: 0 },
        { tax: 1000 },
        { tax: 2400 },
      ],
    ];

    const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

    assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
  });
});
