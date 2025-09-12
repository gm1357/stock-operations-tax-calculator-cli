import { exit } from 'node:process';
import { readInputLines, outputToStdOut } from './utils/io-handler.js';
import { parseLedgers, calculateManyLedgersTaxes } from './domain/ledgers.js';

try {
  const lines = await readInputLines();
  const operationsLedgers = parseLedgers(lines);

  const results = calculateManyLedgersTaxes(operationsLedgers);
  outputToStdOut(results);
  exit(0);
} catch (error) {
  console.error('Error processing input:', error);
  exit(1);
}
