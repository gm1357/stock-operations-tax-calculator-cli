import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render } from 'ink-testing-library';
import InteractiveApp from '../../dist/ui/components/InteractiveApp.js';
import { INSUFFICIENT_STOCK_ERROR } from '../../src/domain/constants.js';

const tick = () => new Promise((resolve) => setImmediate(resolve));

const ENTER = '\r';

const renderApp = () => render(React.createElement(InteractiveApp));

const allOutput = ({ frames }) => frames.join('\n');

describe('Integration Test - Interactive flow', () => {
  it('processes a single typed ledger and produces tax results', async () => {
    const instance = renderApp();

    const ledger =
      '[{"operation":"buy", "unit-cost":10.00, "quantity":100},' +
      ' {"operation":"sell", "unit-cost":15.00, "quantity":50},' +
      ' {"operation":"sell", "unit-cost":15.00, "quantity":50}]';

    instance.stdin.write(ledger);
    await tick();
    instance.stdin.write(ENTER);
    await tick();
    instance.stdin.write(ENTER);
    await tick();

    assert.match(allOutput(instance), /\[\{"tax":0\},\{"tax":0\},\{"tax":0\}\]/);
  });

  it('processes multiple typed ledgers, one per line', async () => {
    const instance = renderApp();

    const first =
      '[{"operation":"buy", "unit-cost":10.00, "quantity":100},' +
      ' {"operation":"sell", "unit-cost":15.00, "quantity":50},' +
      ' {"operation":"sell", "unit-cost":15.00, "quantity":50}]';
    const second =
      '[{"operation":"buy", "unit-cost":10.00, "quantity":10000},' +
      ' {"operation":"sell", "unit-cost":20.00, "quantity":5000},' +
      ' {"operation":"sell", "unit-cost":5.00, "quantity":5000}]';

    instance.stdin.write(first);
    await tick();
    instance.stdin.write(ENTER);
    await tick();
    instance.stdin.write(second);
    await tick();
    instance.stdin.write(ENTER);
    await tick();
    instance.stdin.write(ENTER);
    await tick();

    const output = allOutput(instance);
    assert.match(output, /\[\{"tax":0\},\{"tax":0\},\{"tax":0\}\]/);
    assert.match(output, /\[\{"tax":0\},\{"tax":10000\},\{"tax":0\}\]/);
  });

  it('renders an error for invalid JSON input', async () => {
    const instance = renderApp();

    instance.stdin.write('not valid json');
    await tick();
    instance.stdin.write(ENTER);
    await tick();
    instance.stdin.write(ENTER);
    await tick();

    assert.match(allOutput(instance), /Error:/);
  });

  it('renders insufficient-stock error for oversell', async () => {
    const instance = renderApp();

    const ledger =
      '[{"operation":"buy", "unit-cost":10.00, "quantity":100},' +
      ' {"operation":"sell", "unit-cost":15.00, "quantity":150}]';

    instance.stdin.write(ledger);
    await tick();
    instance.stdin.write(ENTER);
    await tick();
    instance.stdin.write(ENTER);
    await tick();

    assert.match(
      allOutput(instance),
      new RegExp(`"error":"${INSUFFICIENT_STOCK_ERROR}"`),
    );
  });
});
