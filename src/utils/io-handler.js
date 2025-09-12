export async function readInputLines(readLineInterface) {
  const lines = [];

  for await (const line of readLineInterface) {
    if (line.trim() === '') {
      break;
    }
    lines.push(line);
  }

  readLineInterface.close();

  return lines;
}

export function outputToStdOut(results) {
  results.forEach((result) => {
    console.log(JSON.stringify(result));
  });
}
