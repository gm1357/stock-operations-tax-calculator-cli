# Stock Operations Tax Calculator

A simple CLI tool to calculate taxes on stock operations based on specific tax rules.

## Overview

This tool calculates taxes for stock operations based on the following rules:

1. No tax is applied on "buy" operations.
2. No tax is applied on "sell" operations if the total amount is less than or equal to $20,000.
3. If the total amount of a "sell" operation exceeds $20,000, a tax of 20% is applied on the profit.
4. If there is a loss in any operation, it is used to offset profits in subsequent operations.

## Usage

The CLI tool accepts input through stdin and outputs the results to stdout. Each input line should contain a JSON array with stock operations.

### Input Format

Each operation is a JSON object with the following properties:

- `operation`: Either "buy" or "sell"
- `unit-cost`: The unit cost of the stock
- `quantity`: The number of stocks bought or sold

Example input:

```json
[{"operation":"buy", "unit-cost":10.00, "quantity":100}, {"operation":"sell", "unit-cost":15.00, "quantity":50}, {"operation":"sell", "unit-cost":15.00, "quantity":50}]
[{"operation":"buy", "unit-cost":10.00, "quantity":10000}, {"operation":"sell", "unit-cost":20.00, "quantity":5000}, {"operation":"sell", "unit-cost":5.00, "quantity":5000}]
```

### Output Format

The output will be JSON objects, each representing the tax to be paid for a specific operation:

```json
[{"tax":0}, {"tax":0}, {"tax":0}]
[{"tax":0}, {"tax":10000}, {"tax":0}]
```

### Running the CLI

If you don't have Node.js installed, please download the latest LTS version and install it from [nodejs.org](https://nodejs.org/en/download/).

Or, use [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) to install and use latest version:

```bash
nvm install
nvm use
```

The terminal UI is built with [Ink](https://github.com/vadimdemedes/ink), which renders React components to the terminal. Because the source uses JSX, it must be compiled with Babel before running.

Build the CLI (outputs to `dist/`):

```bash
npm run build
```

Run the CLI tool interactively:

```bash
npm start
# Then input your JSON and press Enter
# Press Enter again with an empty line to finish input

# Or directly with Node.js
node dist/ui/cli.js
```

You can also provide input from a file and even redirect the output to another file:

```bash
# Using npm script
npm start < input.txt > output.txt

# Or directly with Node.js
node dist/ui/cli.js < input.txt > output.txt
```

## Running Tests

This project uses Node.js built-in test runner. `npm test` runs `npm run build` first so integration tests execute against the compiled CLI in `dist/`.

```bash
# Run all tests (builds first)
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run specific test file
node --test tests/unit/domain/ledgers.test.js
```
