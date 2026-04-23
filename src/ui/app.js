// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useStdin } from 'ink';
import InteractiveApp from './components/InteractiveApp.js';
import PipedApp from './components/PipedApp.js';

export default function App() {
  const { isRawModeSupported } = useStdin();
  const isInteractive = isRawModeSupported && process.stdin.isTTY;
  return isInteractive ? <InteractiveApp /> : <PipedApp />;
}
