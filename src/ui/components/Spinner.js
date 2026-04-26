import React from 'react';
import { Text, useAnimation } from 'ink';

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const INTERVAL_MS = 80;

export default function Spinner({ label = 'Processing...' }) {
  const { frame } = useAnimation({ interval: INTERVAL_MS, isActive: true });
  return <Text>{FRAMES[frame % FRAMES.length]} {label}</Text>;
}
