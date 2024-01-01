import { Solution, TwoSolutions } from 'types/Solution';

type Models = { numbersList: number[][] };

function calculateDifferences(numbers: number[]): number[] {
    const differences: number[] = [];
    for (let i = 0; i < numbers.length - 1; i++) {
        // console.log(`    for loop, ${i}`);
        differences.push(numbers[i + 1] - numbers[i]);
    }
    return differences;
}

function calculateDifferencesList(numbers: number[]): number[][] {
    // console.log('Calculating Differences List for one set of numbers');

    const differencesList: number[][] = [numbers, calculateDifferences(numbers)];
    while (differencesList[differencesList.length - 1].filter(x => x !== 0).length > 0) {
        // console.log(`  while loop, ${differencesList}`);
        const numbers2 = differencesList[differencesList.length - 1];
        const differences: number[] = [];
        for (let i = 0; i < numbers2.length - 1; i++) {
            // console.log(`    for loop, ${i}`);
            differences.push(numbers2[i + 1] - numbers2[i]);
        }
        differencesList.push(differences);
    }
    return differencesList;
}

function getForwardExtrapolatedValue(differencesList: number[][]): number {
    for (let i = differencesList.length - 1; i >= 0; i--) {
        if (differencesList.length - 1 === i) {
            differencesList[i].push(0);
            continue;
        }
        const iLength = differencesList[i].length;
        const prevValue = differencesList[i][iLength - 1];
        const addValue = differencesList[i + 1][iLength - 1];

        differencesList[i].push(prevValue + addValue);
    }

    // console.log(differencesList.join('\n'));
    return differencesList[0][differencesList[0].length - 1];
}

function getBackwardExtrapolatedValue(differencesList: number[][]): number {
    for (let i = differencesList.length - 1; i >= 0; i--) {
        if (differencesList.length - 1 === i) {
            differencesList[i].push(0);
            continue;
        }
        const prevValue = differencesList[i][0];
        const subtractValue = differencesList[i + 1][0];

        differencesList[i].unshift(prevValue - subtractValue);
    }

    // console.log(differencesList.join('\n'));
    return differencesList[0][0];
}

export class MySolution implements Solution {
    parseLinesToModels(lines: string[]): Models {
        const numbersList: number[][] = [];
        const splitLines = lines.map(line => line.split(' '));
        splitLines.forEach(line => {
            const numbers: number[] = [];
            line.forEach(string => numbers.push(Number(string)));
            numbersList.push(numbers);
        });
        return { numbersList };
    }

    get(models: Models): TwoSolutions {
        const forwardExtrapolatedValues: number[] = [];
        const backwardExtrapolatedValues: number[] = [];

        models.numbersList.forEach(numbers => {
            const differencesList = calculateDifferencesList(numbers);
            // console.log(`\nbefore\n${differencesList.join('\n')}`);
            forwardExtrapolatedValues.push(getForwardExtrapolatedValue([...differencesList]));
            backwardExtrapolatedValues.push(getBackwardExtrapolatedValue([...differencesList]));
        });

        const sumOfForwardExtrapolatedValues = forwardExtrapolatedValues.reduce((sum, next) => sum + next);
        const sumOfBackwardExtrapolatedValues = backwardExtrapolatedValues.reduce((sum, next) => sum + next);

        return { partOne: sumOfForwardExtrapolatedValues, partTwo: sumOfBackwardExtrapolatedValues }; // Part 1: 1993300041, Part 2: 1038
    }
}
