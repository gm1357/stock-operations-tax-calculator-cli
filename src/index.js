import { exit } from 'node:process';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { readInputLines, outputToStdOut } from './utils/io-handler.js';
import { parseLedgers, calculateManyLedgersTaxes } from './domain/ledgers.js';

const rl = readline.createInterface({
  input,
  output,
});

try {
  const lines = await readInputLines(rl);
  const operationsLedgers = parseLedgers(lines);

  const results = calculateManyLedgersTaxes(operationsLedgers);
  outputToStdOut(results);
  exit(0);
} catch (error) {
  console.error('Error processing input:', error);
  exit(1);
}
