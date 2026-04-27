#!/usr/bin/env node
import React from 'react';
import { PassThrough } from 'node:stream';
import { render } from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
  `
    Usage
      $ sotcc [options]

    Options
      --raw, -r  Use legacy interactive mode (one JSON ledger per line)
      --about    Show information about the project
      --help     Show this help message

    Interactively enter operations details to calculate taxes,
    or pipe a file with one JSON ledger per line.

    Read from stdin in piped mode:
      $ cat ledgers.txt | sotcc
  `,
  {
    importMeta: import.meta,
    flags: {
      raw: {
        type: 'boolean',
        shortFlag: 'r',
        default: false,
      },
      about: {
        type: 'boolean',
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
    <App raw={cli.flags.raw} about={cli.flags.about} />,
    isInteractive ? undefined : { stdout: sink },
  );
  await waitUntilExit();
  process.exit(0);
} catch (error) {
  console.error('Error processing input:', error);
  process.exit(1);
}
