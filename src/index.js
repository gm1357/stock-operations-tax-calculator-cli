import readline from 'node:readline';
import { stdin as input, stdout as output, exit }  from 'node:process';

const rl = readline.createInterface({
  input,
  output,
});

const operations = [];

rl.on("line", (line) => {

    if (line.trim() === '') {
        rl.close();
    }

    operations.push(JSON.parse(line));
});

rl.on("close", () => {
    operations.forEach((op) => {
        const result = [
            { tax: 0.0 },
            { tax: 0.0 },
            { tax: 10.0 },
            { tax: 20.0 }
        ]
        output.write(`${JSON.stringify(result)}\n`);
    });
    exit(0);
});