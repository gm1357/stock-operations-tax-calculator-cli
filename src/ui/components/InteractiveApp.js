import React, { useEffect, useState } from 'react';
import { Text, Box, useApp } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from './Spinner.js';

export default function InteractiveApp() {
  const { exit } = useApp();
  const [currentOperation, setCurrentOperation] = useState(null);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
        {loading && <Spinner />}
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
