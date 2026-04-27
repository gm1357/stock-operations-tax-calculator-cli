import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render } from 'ink-testing-library';
import InteractiveApp from '../../dist/ui/components/InteractiveApp.js';
import { INSUFFICIENT_STOCK_ERROR } from '../../src/domain/constants.js';

const LOADER_DELAY_MS = 2000;

const tick = () => new Promise((resolve) => setImmediate(resolve));
const flush = async () => {
  for (let i = 0; i < 10; i++) await tick();
};

const ENTER = '\r';
const SELECT_NEXT = 'j';

const renderApp = () => {
  const instance = render(React.createElement(InteractiveApp));
  Object.defineProperty(Object.getPrototypeOf(instance.stdout), 'columns', {
    get: () => 300,
    configurable: true,
  });
  return instance;
};

const allOutput = ({ frames }) => frames.join('\n');

const writeAndTick = async (instance, value) => {
  instance.stdin.write(value);
  await tick();
};

const selectOperationType = async (instance, type) => {
  if (type === 'sell') await writeAndTick(instance, SELECT_NEXT);
  await writeAndTick(instance, ENTER);
};

const enterUnitCostAndQuantity = async (instance, unitCost, quantity) => {
  await writeAndTick(instance, String(unitCost));
  await writeAndTick(instance, ENTER);
  await writeAndTick(instance, String(quantity));
  await writeAndTick(instance, ENTER);
};

const answerAddMore = async (instance, addMore) => {
  if (!addMore) await writeAndTick(instance, SELECT_NEXT);
  await writeAndTick(instance, ENTER);
};

const addOperation = async (instance, type, unitCost, quantity, addMore) => {
  await selectOperationType(instance, type);
  await enterUnitCostAndQuantity(instance, unitCost, quantity);
  await answerAddMore(instance, addMore);
};

describe('Integration Test - Interactive flow', () => {
  it('processes a single ledger built step-by-step and produces tax results', async (t) => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    const instance = renderApp();

    await addOperation(instance, 'buy', '10.00', '100', true);
    await addOperation(instance, 'sell', '15.00', '50', true);
    await addOperation(instance, 'sell', '15.00', '50', false);

    assert.match(allOutput(instance), /Processing\.\.\./);

    t.mock.timers.tick(LOADER_DELAY_MS);
    await flush();

    assert.match(
      allOutput(instance),
      /\[\{"tax":0\},\{"tax":0\},\{"tax":0\}\]/,
    );
  });

  it('renders insufficient-stock error for oversell', async (t) => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    const instance = renderApp();

    await addOperation(instance, 'buy', '10.00', '100', true);
    await addOperation(instance, 'sell', '15.00', '150', false);

    t.mock.timers.tick(LOADER_DELAY_MS);
    await flush();

    assert.match(
      allOutput(instance),
      new RegExp(`"error":"${INSUFFICIENT_STOCK_ERROR}"`),
    );
  });
});
