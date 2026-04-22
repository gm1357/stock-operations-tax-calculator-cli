#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './app.js';
import { parseLedgers, calculateManyLedgersTaxes } from '../domain/ledgers.js';

meow(
  `
		Usage
		  $ stock-operations-tax-calculator-cli

		Reads one JSON ledger per line from stdin until an empty line,
		then prints tax results as JSON, one per line.
	`,
  {
    importMeta: import.meta,
  },
);

async function readPipedStdin() {
  const lines = [];
  let buffer = '';

  process.stdin.setEncoding('utf8');

  for await (const chunk of process.stdin) {
    buffer += chunk;
    let newlineIndex;
    while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      if (line.trim() === '') {
        return lines;
      }
      lines.push(line);
    }
  }

  if (buffer.trim() !== '') {
    lines.push(buffer);
  }

  return lines;
}

try {
  const lines = await readPipedStdin();
  const ledgers = parseLedgers(lines);
  const results = calculateManyLedgersTaxes(ledgers);

  if (results.length === 0) {
    process.exit(0);
  }

  const { waitUntilExit } = render(<App results={results} />);
  await waitUntilExit();
  process.exit(0);
} catch (error) {
  console.error('Error processing input:', error);
  process.exit(1);
}
