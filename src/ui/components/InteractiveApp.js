import React, { useEffect, useState } from 'react';
import { Text, Box, useApp, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from './Spinner.js';
import { calculateManyLedgersTaxes } from '../../domain/ledgers.js';

export default function InteractiveApp() {
  const { exit } = useApp();
  const [currentOperation, setCurrentOperation] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('operation-type');
  const [unitCost, setUnitCost] = useState('');
  const [quantity, setQuantity] = useState('');
  const [operations, setOperations] = useState([]);

  const operationTypeOptions = [
    { label: 'Buy', value: 'buy' },
    { label: 'Sell', value: 'sell' },
  ];

  useEffect(() => {
    if (results !== null || error !== null) exit();
  }, [results, error, exit]);

  useInput(
    (character, key) => {
      if (step === 'unit-cost') {
        if (key.return) {
          setStep("quantity");
        } else if (key.backspace || key.delete) {
          setUnitCost((current) => current.slice(0, -1));
        } else if (character) {
          setUnitCost((current) => current + character);
        }
      }

      if (step === 'quantity') {
        if (key.return) {
          const operation = {
            operation: currentOperation?.value,
            "unit-cost": parseFloat(unitCost),
            quantity: parseInt(quantity),
          };
          setOperations((previous) => [...previous, operation]);
          setStep("add-more");
        } else if (key.backspace || key.delete) {
          setQuantity((current) => current.slice(0, -1));
        } else if (character) {
          setQuantity((current) => current + character);
        }
      }
    },
    { isActive: step === 'unit-cost' || step === 'quantity' },
  );

  const handleSelectOperationType = (operationType) => {
    setCurrentOperation(operationType);
    setStep('unit-cost');
  };

  const handleSelectAddMore = (addMore) => {
    if (addMore.value === 'yes') {
      setStep('operation-type');
      setCurrentOperation(null);
      setUnitCost('');
      setQuantity('');
    } else {
      setStep('processing');
      setTimeout(() => {
        setResults(calculateManyLedgersTaxes([operations]));
        setStep('results');
      }, 2000);
    }
  };

  const renderSelectStep = () => (
    <>
      <Text dimColor>Select the operation type</Text>
      <SelectInput
        items={operationTypeOptions}
        onSelect={handleSelectOperationType}
      />
    </>
  );

  const renderUnitCostStep = () => (
    <>
      <Text dimColor>{`Enter the unit cost for ${currentOperation?.label} operation`}</Text>
      <Text>{unitCost}</Text>
    </>
  );

  const renderQuantityStep = () => (
    <>
      <Text dimColor>{`Enter the quantity for ${currentOperation?.label} operation`}</Text>
      <Text>{quantity}</Text>
    </>
  );

  const renderAddMoreStep = () => (
    <>
      <Text dimColor>Add more operations?</Text>
      <SelectInput
        items={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        onSelect={handleSelectAddMore}
      />
    </>
  );

  const renderResultsStep = () => (
    <>
      <Text>Results</Text>
      {results.map((result, index) => (
        <Text dimColor key={index}>{JSON.stringify(result)}</Text>
      ))}
    </>
  );

  return (
    <Box flexDirection="row" justifyContent="space-between">
      <Box flexGrow={1} flexDirection="column" borderStyle="round" padding={1}>
        {step === 'operation-type' && renderSelectStep()}
        {step === 'unit-cost' && renderUnitCostStep()}
        {step === 'quantity' && renderQuantityStep()}
        {step === 'add-more' && renderAddMoreStep()}
        {step === 'processing' && <Spinner />}
        {step === 'results' && renderResultsStep()}
        {error && <Text color="red">Error: {error} </Text>}
      </Box>
      <Box flexDirection="column" borderStyle="round" padding={1}>
        <Text>List of operations</Text>
        {operations.map((operation, index) => (
          <Text dimColor key={index}>{`${index + 1}: ${JSON.stringify(operation)}`}</Text>
        ))}
      </Box>
      <Box flexDirection="column" borderStyle="round" padding={1}>
        <Text>Current operation</Text>
        <Text dimColor>Operation: {currentOperation?.label}</Text>
        <Text dimColor>Unit cost: {unitCost}</Text>
        <Text dimColor>Quantity: {quantity}</Text>
      </Box>
    </Box>
  );
}
