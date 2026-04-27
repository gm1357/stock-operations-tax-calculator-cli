#!/usr/bin/env node
import React from 'react';
import { PassThrough } from 'node:stream';
import { render } from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
  `
		Usage
		  $ stock-operations-tax-calculator-cli

		Options
		  --raw, -r  Use legacy interactive mode

		Reads one JSON ledger per line from stdin until an empty line,
		then prints tax results as JSON, one per line.
	`,
  {
    importMeta: import.meta,
    flags: {
      raw: {
        type: 'boolean',
        shortFlag: 'r',
        default: false,
      },
    },
  },
);

const isInteractive = Boolean(process.stdin.isTTY);

const sink = new PassThrough();
sink.resume();

try {
  const { waitUntilExit } = render(
    <App raw={cli.flags.raw} />,
    isInteractive ? undefined : { stdout: sink },
  );
  await waitUntilExit();
  process.exit(0);
} catch (error) {
  console.error('Error processing input:', error);
  process.exit(1);
}
