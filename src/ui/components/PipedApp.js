import { useEffect } from 'react';
import { useStdin } from 'ink';
import {
  parseLedgers,
  calculateManyLedgersTaxes,
} from '../../domain/ledgers.js';

export default function PipedApp() {
  const { stdin } = useStdin();

  useEffect(() => {
    const collected = [];
    let buffer = '';
    let finished = false;

    stdin.setEncoding('utf8');

    const finish = () => {
      if (finished) return;
      finished = true;
      stdin.off('data', handleData);
      stdin.off('end', handleEnd);
      try {
        const ledgers = parseLedgers(collected);
        const results = calculateManyLedgersTaxes(ledgers);
        for (const result of results) {
          process.stdout.write(JSON.stringify(result) + '\n');
        }
        process.exit(0);
      } catch (err) {
        process.stderr.write(`Error processing input: ${err.stack || err}\n`);
        process.exit(1);
      }
    };

    const handleData = (chunk) => {
      buffer += chunk;
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        if (line.trim() === '') {
          finish();
          return;
        }
        collected.push(line);
      }
    };

    const handleEnd = () => {
      if (buffer.trim() !== '') collected.push(buffer);
      finish();
    };

    stdin.on('data', handleData);
    stdin.on('end', handleEnd);

    return () => {
      stdin.off('data', handleData);
      stdin.off('end', handleEnd);
    };
  }, [stdin]);

  return null;
}
