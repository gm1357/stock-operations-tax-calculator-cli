#!/usr/bin/env node
import React from 'react';
import { PassThrough } from 'node:stream';
import { render } from 'ink';
import meow from 'meow';
import App from './app.js';

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

const isInteractive = Boolean(process.stdin.isTTY);

const sink = new PassThrough();
sink.resume();

try {
  const { waitUntilExit } = render(
    <App />,
    isInteractive ? undefined : { stdout: sink },
  );
  await waitUntilExit();
  process.exit(0);
} catch (error) {
  console.error('Error processing input:', error);
  process.exit(1);
}
