import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  Box,
  useApp,
  useInput,
  usePaste,
  useCursor,
  useBoxMetrics,
  useAnimation,
} from 'ink';
import stringWidth from 'string-width';
import {
  parseLedgers,
  calculateManyLedgersTaxes,
} from '../../domain/ledgers.js';

const DELAY_MS = 2000;
const ANIMATION_INTERVAL_MS = 80;

export default function InteractiveLegacyApp() {
  const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const { exit } = useApp();
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [done, setDone] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setCursorPosition } = useCursor();
  const ref = useRef(null);
  const { width, height, hasMeasured } = useBoxMetrics(ref);
  const { frame } = useAnimation({
    interval: ANIMATION_INTERVAL_MS,
    isActive: true,
  });

  useInput(
    (character, key) => {
      if (done) return;

      if (key.return) {
        if (input.trim() === '') {
          setDone(true);
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, DELAY_MS);
        } else {
          setLines((previous) => [...previous, input]);
          setInput('');
        }
      } else if (key.backspace || key.delete) {
        setInput((current) => current.slice(0, -1));
      } else if (character) {
        setInput((current) => current + character);
      }
    },
    { isActive: !done },
  );

  usePaste((content) => {
    const pastedLines = content.split(/\r\n|\n|\r/);
    const [lastLine, ...rest] = pastedLines.reverse();

    setLines((previous) => [...previous, ...rest]);
    setInput((current) => current + lastLine);
  });

  useEffect(() => {
    if (!done) return;
    try {
      const ledgers = parseLedgers(lines);
      setResults(calculateManyLedgersTaxes(ledgers));
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [done, lines]);

  useEffect(() => {
    if ((results !== null || error !== null) && !loading) exit();
  }, [results, error, loading, exit]);

  const prompt = '> ';

  if (hasMeasured && !done) {
    const cursorX = stringWidth(prompt + input) % width;
    const textWrapped = cursorX === 0 && input.length > 0;
    const cursorY = textWrapped ? height : height - 1;

    setCursorPosition({
      x: cursorX,
      y: cursorY,
    });
  }

  if (done) {
    setCursorPosition(undefined);
  }

  const spinner = spinnerFrames[frame % spinnerFrames.length];

  return (
    <Box flexDirection="column" ref={ref}>
      {!done && (
        <>
          <Text dimColor>
            Enter one JSON ledger per line. Press Enter on an empty line to
            finish.
          </Text>
          {lines.map((line, index) => (
            <Text key={index} dimColor>
              {index + 1}: {line}
            </Text>
          ))}
          <Text wrap="hard">
            {prompt}
            {input}
          </Text>
        </>
      )}
      {loading && <Text>{spinner} Processing...</Text>}
      {results &&
        !loading &&
        results.map((result, index) => (
          <Text key={index}>{JSON.stringify(result)}</Text>
        ))}
      {error && <Text color="red">Error: {error} </Text>}
    </Box>
  );
}
