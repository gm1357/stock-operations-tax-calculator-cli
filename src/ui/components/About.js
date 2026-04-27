import React from 'react';
import { Box, Text } from 'ink';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import Link from 'ink-link';

export default function About() {
  return (
    <Box flexDirection="column" padding={1} gap={1}>
      <Gradient name="cristal">
        <BigText text="SOTCC" />
      </Gradient>

      <Text>
        Stock Operations Tax Calculator CLI (SOTCC), is a simple cli tool for
        calculating taxes on stock operations.
      </Text>
      <Text>
        It's simplicity comes from the fact it was built initially as way to
        practice node cli apps, and then it evolved to practicing tui with ink.
      </Text>
      <Text>
        It supports both interactive and piped modes, allowing you to choose the
        one that best suits your needs.
      </Text>
      <Text>
        Built with ❤️ by{' '}
        <Link url="https://github.com/gm1357" color="cyan">
          <Text color="cyan">Gabriel Machado</Text>
        </Link>
      </Text>
    </Box>
  );
}
