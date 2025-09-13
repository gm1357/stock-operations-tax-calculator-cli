import { exec } from 'node:child_process';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import path from 'node:path';

const cliPath = path.resolve('./src/index.js');

describe('Integration Test - CLI', () => {
  it('should process single line input typed by user and produce correct output', (_, done) => {
    const input = [
      '[{"operation":"buy", "unit-cost":10.00, "quantity":100}, {"operation":"sell", "unit-cost":15.00, "quantity":50}, {"operation":"sell", "unit-cost":15.00, "quantity":50}]',
      '',
    ].join('\n');

    const expectedOutput =
      ['[{"tax":0},{"tax":0},{"tax":0}]'].join('\n') + '\n';

    const child = exec(`node ${cliPath}`, (error, stdout, stderr) => {
      if (error) {
        done(error);
        return;
      }
      if (stderr) {
        done(new Error(stderr));
        return;
      }

      try {
        assert.strictEqual(stdout, expectedOutput);
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });

    child.stdin.write(input);
    child.stdin.end();
  });

  it('should not process input data after empty line typed by user and produce correct output', (_, done) => {
    const input = [
      '[{"operation":"buy", "unit-cost":10.00, "quantity":100}, {"operation":"sell", "unit-cost":15.00, "quantity":50}, {"operation":"sell", "unit-cost":15.00, "quantity":50}]',
      '',
      '[{"operation":"buy", "unit-cost":10.00, "quantity":10000}, {"operation":"sell", "unit-cost":20.00, "quantity":5000}, {"operation":"sell", "unit-cost":5.00, "quantity":5000}]',
    ].join('\n');

    const expectedOutput =
      ['[{"tax":0},{"tax":0},{"tax":0}]'].join('\n') + '\n';

    const child = exec(`node ${cliPath}`, (error, stdout, stderr) => {
      if (error) {
        done(error);
        return;
      }
      if (stderr) {
        done(new Error(stderr));
        return;
      }

      try {
        assert.strictEqual(stdout, expectedOutput);
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });

    child.stdin.write(input);
    child.stdin.end();
  });

  it('should process multi line input typed by user and produce correct output', (_, done) => {
    const input = [
      '[{"operation":"buy", "unit-cost":10.00, "quantity":100}, {"operation":"sell", "unit-cost":15.00, "quantity":50}, {"operation":"sell", "unit-cost":15.00, "quantity":50}]',
      '[{"operation":"buy", "unit-cost":10.00, "quantity":10000}, {"operation":"sell", "unit-cost":20.00, "quantity":5000}, {"operation":"sell", "unit-cost":5.00, "quantity":5000}]',
      '',
    ].join('\n');

    const expectedOutput =
      [
        '[{"tax":0},{"tax":0},{"tax":0}]',
        '[{"tax":0},{"tax":10000},{"tax":0}]',
      ].join('\n') + '\n';

    const child = exec(`node ${cliPath}`, (error, stdout, stderr) => {
      if (error) {
        done(error);
        return;
      }
      if (stderr) {
        done(new Error(stderr));
        return;
      }

      try {
        assert.strictEqual(stdout, expectedOutput);
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });

    child.stdin.write(input);
    child.stdin.end();
  });

  it('should not produce output on empty input', (_, done) => {
    const input = [''].join('\n');

    const expectedOutput = '';

    const child = exec(`node ${cliPath}`, (error, stdout, stderr) => {
      if (error) {
        done(error);
        return;
      }
      if (stderr) {
        done(new Error(stderr));
        return;
      }

      try {
        assert.strictEqual(stdout, expectedOutput);
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });

    child.stdin.write(input);
    child.stdin.end();
  });

  it('should accept input from file and produce correct output', (_, done) => {
    const expectedOutput =
      [
        '[{"tax":0},{"tax":0},{"tax":0}]',
        '[{"tax":0},{"tax":10000},{"tax":0}]',
      ].join('\n') + '\n';

    exec(
      `node ${cliPath} < ./tests/integration/test-input.txt`,
      (error, stdout, stderr) => {
        if (error) {
          done(error);
          return;
        }
        if (stderr) {
          done(new Error(stderr));
          return;
        }

        try {
          assert.strictEqual(stdout, expectedOutput);
          done();
        } catch (assertionError) {
          done(assertionError);
        }
      },
    );
  });
});
