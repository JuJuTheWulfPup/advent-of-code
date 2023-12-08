import { readFileSync } from 'node:fs';

const input = readFileSync('./input.txt', { encoding: 'utf8' });
const lines = input.split('\n');

const goal = {
    red: 12,
    green: 13,
    blue: 14
};

let sumOfQualified = 0;
let sumOfProducts = 0;

lines.forEach(line => {
    const [gameName, setsString] = line.split(':');
    const sets = setsString.split(';');

    let qualifies = true;
    const lowest = {
        red: 0,
        green: 0,
        blue: 0
    };
    sets.forEach(set => {
        const colorSets = set.split(',');

        colorSets.forEach(colorSet => {
            colorSet = colorSet.trim();
            const [numberString, color] = colorSet.split(' ');
            const number = Number(numberString);
            if (goal[color] < number) {
                qualifies = false;
            }
            // todo: short circuit ??????????

            if (lowest[color] < number) {
                lowest[color] = number;
            }
        });
    });

    if (qualifies) {
        sumOfQualified += Number(gameName.substring(5));
    }
    sumOfProducts += lowest.red * lowest.green * lowest.blue;
});

console.log(`Part 1: ${sumOfQualified}, Part 2: ${sumOfProducts}`); // Part 1: 2617, Part 2: 59795
