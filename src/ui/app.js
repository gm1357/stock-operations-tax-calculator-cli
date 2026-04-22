import React, { useEffect } from 'react';
import { Text, Box, useApp } from 'ink';

export default function App({ results }) {
  const { exit } = useApp();

  useEffect(() => {
    exit();
  }, [exit]);

  return (
    <Box flexDirection="column">
      {results.map((result, index) => (
        <Text key={index}>{JSON.stringify(result)}</Text>
      ))}
    </Box>
  );
}
