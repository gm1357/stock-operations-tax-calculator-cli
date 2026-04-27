// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useStdin } from 'ink';
import InteractiveApp from './components/InteractiveApp.js';
import InteractiveLegacyApp from './components/InteractiveLegacyApp.js';
import PipedApp from './components/PipedApp.js';
import About from './components/About.js';

export default function App({ raw, about }) {
  const { isRawModeSupported } = useStdin();
  const isInteractive = isRawModeSupported && process.stdin.isTTY;

  if (about) {
    return <About />;
  }

  if (!isInteractive) {
    return <PipedApp />;
  }

  return raw ? <InteractiveLegacyApp /> : <InteractiveApp />;
}
