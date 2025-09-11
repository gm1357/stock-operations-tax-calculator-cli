import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateManyLedgersTaxes } from '../../src/tax-calculator.js';

describe('calculateManyLedgersTaxes', () => {
    it('should calculate taxes correctly for Case #1', () => {
        const ledgers = [
            [
                { "operation": "buy", "unit-cost": 10, "quantity": 100 },
                { "operation": "sell", "unit-cost": 15, "quantity": 50 },
                { "operation": "sell", "unit-cost": 15, "quantity": 50 }
            ],
        ];
        const expectedTaxes = [
            [
                { tax: 0 },
                { tax: 0 },
                { tax: 0 }
            ]
        ];

        const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

        assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
    });

    it('should calculate taxes correctly for Case #2', { todo: true }, () => {
        const ledgers = [
            [
                { "operation": "buy", "unit-cost": 10, "quantity": 10000 },
                { "operation": "sell", "unit-cost": 20, "quantity": 5000 },
                { "operation": "sell", "unit-cost": 5, "quantity": 5000 }
            ],
        ];
        const expectedTaxes = [
            [
                { tax: 0 },
                { tax: 10000 },
                { tax: 0 }
            ]
        ];

        const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

        assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
    });

    it('should calculate taxes correctly for Case #1 + Case #2', { skip: true }, { todo: true }, () => {
        const ledgers = [
            [
                { "operation": "buy", "unit-cost": 10, "quantity": 100 },
                { "operation": "sell", "unit-cost": 15, "quantity": 50 },
                { "operation": "sell", "unit-cost": 15, "quantity": 50 }
            ],
            [
                { "operation": "buy", "unit-cost": 10, "quantity": 10000 },
                { "operation": "sell", "unit-cost": 20, "quantity": 5000 },
                { "operation": "sell", "unit-cost": 5, "quantity": 5000 }
            ],
        ];
        const expectedTaxes = [
             [
                { tax: 0 },
                { tax: 0 },
                { tax: 0 }
            ],
            [
                { tax: 0 },
                { tax: 10000 },
                { tax: 0 }
            ]
        ];

        const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

        assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
    });

    it('should calculate taxes correctly for Case #3', { skip: true }, { todo: true }, () => {
        const ledgers = [
            [
                { "operation": "buy", "unit-cost": 10, "quantity": 10000 },
                { "operation": "sell", "unit-cost": 5, "quantity": 5000 },
                { "operation": "sell", "unit-cost": 20, "quantity": 3000 }
            ],
        ];
        const expectedTaxes = [
            [
                { tax: 0 },
                { tax: 0 },
                { tax: 1000 }
            ]
        ];

        const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

        assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
    });

    it('should calculate taxes correctly for Case #4', { skip: true }, { todo: true }, () => {
        const ledgers = [
            [
                { "operation": "buy", "unit-cost": 10, "quantity": 10000 },
                { "operation": "buy", "unit-cost": 25, "quantity": 5000 },
                { "operation": "sell", "unit-cost": 15, "quantity": 10000 }
            ],
        ];
        const expectedTaxes = [
            [
                { tax: 0 },
                { tax: 0 },
                { tax: 0 }
            ]
        ];

        const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

        assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
    });

    it('should calculate taxes correctly for Case #5', { skip: true }, { todo: true }, () => {
        const ledgers = [
            [
                { "operation": "buy", "unit-cost": 10, "quantity": 10000 },
                { "operation": "buy", "unit-cost": 25, "quantity": 5000 },
                { "operation": "sell", "unit-cost": 15, "quantity": 10000 },
                { "operation": "sell", "unit-cost": 25, "quantity": 5000 },
            ],
        ];
        const expectedTaxes = [
            [
                { tax: 0 },
                { tax: 0 },
                { tax: 0 },
                { tax: 10000 },
            ]
        ];

        const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

        assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
    });

    it('should calculate taxes correctly for Case #6', { skip: true }, { todo: true }, () => {
        const ledgers = [
            [
                { "operation": "buy", "unit-cost": 10, "quantity": 10000 },
                { "operation": "sell", "unit-cost": 2, "quantity": 5000 },
                { "operation": "sell", "unit-cost": 20, "quantity": 2000 },
                { "operation": "sell", "unit-cost": 20, "quantity": 2000 },
                { "operation": "sell", "unit-cost": 25, "quantity": 1000 },
            ],
        ];
        const expectedTaxes = [
            [
                { tax: 0 },
                { tax: 0 },
                { tax: 0 },
                { tax: 0 },
                { tax: 3000 },
            ]
        ];

        const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

        assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
    });

    it('should calculate taxes correctly for Case #7', { skip: true }, { todo: true }, () => {
        const ledgers = [
            [
                { "operation": "buy", "unit-cost": 10, "quantity": 10000 },
                { "operation": "sell", "unit-cost": 2, "quantity": 5000 },
                { "operation": "sell", "unit-cost": 20, "quantity": 2000 },
                { "operation": "sell", "unit-cost": 20, "quantity": 2000 },
                { "operation": "sell", "unit-cost": 25, "quantity": 1000 },
                { "operation": "buy", "unit-cost": 20, "quantity": 10000 },
                { "operation": "sell", "unit-cost": 15, "quantity": 5000 },
                { "operation": "sell", "unit-cost": 30, "quantity": 4350 },
                { "operation": "sell", "unit-cost": 30, "quantity": 650 },
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
            ]
        ];

        const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

        assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
    });

    it('should calculate taxes correctly for Case #8', { skip: true }, { todo: true }, () => {
        const ledgers = [
            [
                { "operation": "buy", "unit-cost": 10, "quantity": 10000 },
                { "operation": "sell", "unit-cost": 50, "quantity": 10000 },
                { "operation": "buy", "unit-cost": 20, "quantity": 10000 },
                { "operation": "sell", "unit-cost": 50, "quantity": 10000 },
            ],
        ];
        const expectedTaxes = [
            [
                { tax: 0 },
                { tax: 80000 },
                { tax: 0 },
                { tax: 60000 },
            ]
        ];

        const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

        assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
    });

    it('should calculate taxes correctly for Case #9', { skip: true }, { todo: true }, () => {
        const ledgers = [
            [
                { "operation": "buy", "unit-cost": 5000, "quantity": 10 },
                { "operation": "sell", "unit-cost": 4000, "quantity": 5 },
                { "operation": "buy", "unit-cost": 15000, "quantity": 5 },
                { "operation": "buy", "unit-cost": 4000, "quantity": 2 },
                { "operation": "buy", "unit-cost": 23000, "quantity": 2 },
                { "operation": "sell", "unit-cost": 20000, "quantity": 1 },
                { "operation": "sell", "unit-cost": 12000, "quantity": 10 },
                { "operation": "sell", "unit-cost": 15000, "quantity": 3 },
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
            ]
        ];

        const calculatedTaxes = calculateManyLedgersTaxes(ledgers);

        assert.deepStrictEqual(calculatedTaxes, expectedTaxes);
    });
});