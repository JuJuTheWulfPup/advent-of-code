import { readFileSync } from 'node:fs';

const input = readFileSync('./input.txt', { encoding: 'utf8' });
const lines = input.split('\n');

let sum = 0;
lines.forEach(line => {
    const firstDigit = line.match(/\d/)![0];
    const secondDigit = [...line].reverse().join('').match(/\d/)![0];

    const combinedDigits = Number(`${firstDigit}${secondDigit}`);
    sum += combinedDigits;
});
console.log(`Part 1: ${sum}`); // Part 1: 53306
