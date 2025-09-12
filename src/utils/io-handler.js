import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export async function readInputLines() {
  const rl = readline.createInterface({
    input,
    output,
  });

  const lines = [];
  for await (const line of rl) {
    if (line.trim() === '') {
      break;
    }
    lines.push(line);
  }
  rl.close();
  return lines;
}

export function outputToStdOut(results) {
  results.forEach((result) => {
    console.log(JSON.stringify(result));
  });
}
