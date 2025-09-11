# Stock Operations Tax Calculator

A simple CLI tool to calculate taxes on stock operations based on Brazilian tax rules.

## Overview

This tool calculates taxes for stock operations based on the following rules:

1. A loss in a stock operation can be compensated in the following months
2. You don't pay taxes when the total sell operations in a month is less than R$ 20.000,00
3. You pay 20% of taxes on profit when the total sell operations in a month is greater than R$ 20.000,00

## Prerequisites

- Node.js (v18 or later)

## Installation

```bash
# Clone the repository
git clone https://github.com/gm1357/stock-operations-tax-calculator-cli.git

# Navigate to the project directory
cd stock-operations-tax-calculator-cli

# Install dependencies
npm install
```

## Usage

The CLI tool accepts input through stdin and outputs the results to stdout. Each input line should contain a JSON array with stock operations for a specific month.

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

### Running the CLI

```bash
# Using npm script
npm start < input.txt > output.txt

# Or directly with Node.js
node src/index.js < input.txt > output.txt
```

You can also run it interactively:

```bash
npm start
# Then input your JSON and press Enter
# Press Enter again with an empty line to finish input
```

### Output Format

The output will be JSON objects, each representing the tax to be paid for a specific operation:

```json
[{"tax":0}, {"tax":0}, {"tax":0}]
[{"tax":0}, {"tax":10000}, {"tax":0}]
```

## Running Tests

This project uses Node.js built-in test runner.

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run specific test file
node --test tests/unit/tax-calculator.test.js
```
