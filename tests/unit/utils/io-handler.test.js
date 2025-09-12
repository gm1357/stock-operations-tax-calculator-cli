import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  readInputLines,
  outputToStdOut,
} from '../../../src/utils/io-handler.js';

describe('readInputLines', () => {
  it('should read multiple lines until an empty line is encountered', async () => {
    const mockReadlineInterface = {
      [Symbol.asyncIterator]: function* () {
        yield 'line 1';
        yield 'line 2';
        yield 'line 3';
        yield '';
        yield 'line after empty';
      },
      close: () => {},
    };

    const expected = ['line 1', 'line 2', 'line 3'];
    const result = await readInputLines(mockReadlineInterface);
    assert.deepStrictEqual(result, expected);
  });

  it('should return an empty array if the first line is empty', async () => {
    const mockReadlineInterface = {
      [Symbol.asyncIterator]: function* () {
        yield '';
        yield 'line 2';
        yield 'line 3';
        yield '';
      },
      close: () => {},
    };

    const expected = [];
    const result = await readInputLines(mockReadlineInterface);
    assert.deepStrictEqual(result, expected);
  });
});

describe('outputToStdOut', () => {
  const originalConsoleLog = console.log;

  beforeEach(() => {
    console.log = mock.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  it('should output each result as a JSON string', () => {
    const results = [[{ tax: 10 }, { tax: 20 }, { tax: 30 }], [{ tax: 0 }]];

    outputToStdOut(results);

    const callCount = console.log.mock.callCount();
    const calls = console.log.mock.calls;
    const argumentFirstCall = calls[0].arguments[0];
    const argumentSecondCall = calls[1].arguments[0];

    assert.strictEqual(callCount, 2);
    assert.deepStrictEqual(argumentFirstCall, JSON.stringify(results[0]));
    assert.deepStrictEqual(argumentSecondCall, JSON.stringify(results[1]));
  });

  it('should not output anything for empty results', () => {
    const results = [];

    outputToStdOut(results);

    const callCount = console.log.mock.callCount();
    assert.strictEqual(callCount, 0);
  });
});
