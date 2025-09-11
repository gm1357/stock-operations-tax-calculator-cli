import readline from 'node:readline';
import { stdin as input, stdout as output, exit }  from 'node:process';
import { calculateManyLedgersTaxes } from './tax-calculator.js';

const rl = readline.createInterface({
  input,
  output,
});

const operationsLedgers = [];

rl.on("line", (line) => {
    if (line.trim() === '') {
        rl.close();
    }

    const operationsLedger = JSON.parse(line);
    operationsLedgers.push(operationsLedger);
});

rl.on("close", () => {
    calculateManyLedgersTaxes(operationsLedgers).forEach(result => {
        console.log(JSON.stringify(result));
    });
    exit(0);
});