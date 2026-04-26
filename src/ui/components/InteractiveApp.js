import React, { useEffect, useState } from 'react';
import { Text, Box, useApp, useAnimation } from 'ink';
import SelectInput from 'ink-select-input';

const ANIMATION_INTERVAL_MS = 80;

export default function InteractiveApp() {
  const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const { exit } = useApp();
  const [currentOperation, setCurrentOperation] = useState(null);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { frame } = useAnimation({
    interval: ANIMATION_INTERVAL_MS,
    isActive: true,
  });
  const operationTypeOptions = [
    { label: 'Buy', value: 'buy' },
    { label: 'Sell', value: 'sell' },
  ];
  const handleSelectOperationType = (operationType) => {
    setCurrentOperation(operationType);
  };

  useEffect(() => {
    if ((results !== null || error !== null) && !loading) exit();
  }, [results, error, loading, exit]);

  const spinner = spinnerFrames[frame % spinnerFrames.length];

  return (
    <Box flexDirection="row" justifyContent="space-between">
      <Box flexGrow={1} flexDirection="column" borderStyle="round" padding={1}>
        {!done && (
          <>
            <Text dimColor>Select the operation type</Text>
            <SelectInput
              items={operationTypeOptions}
              onSelect={handleSelectOperationType}
            />
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
      <Box flexDirection="column" borderStyle="round" padding={1}>
        <Text>List of ledgers</Text>
      </Box>
      <Box flexDirection="column" borderStyle="round" padding={1}>
        <Text>Current ledger</Text>
        <Text>Operation: {currentOperation?.label}</Text>
        <Text>Unit cost: </Text>
        <Text>Quantity: </Text>
      </Box>
    </Box>
  );
}
