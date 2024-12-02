import { Solution, TwoSolutions } from 'types/Solution';

type Models = number[][];

export class MySolution implements Solution {
    private leftSorted: number[] = [];
    private rightSorted: number[] = [];

    parseLinesToModels(lines: string[]): Models {
        return lines.map(line => line.split('   ').map(value => Number(value)));
    }

    partOne(): number {
        const distances = this.leftSorted.map((_, index) => {
            const left = this.leftSorted[index];
            const right = this.rightSorted[index];
            return left >= right ? left - right : right - left;
        });

        return distances.reduce((sum, distance) => sum + distance);
    }

    partTwo(): number {
        const amountOfLeftInRightMap: { [left: number]: number } = this.leftSorted.reduce((result, left) => {
            if (result[left]) {
                return result;
            }
            result[left] = this.rightSorted.filter(x => x === left).length ?? 0;
            return result;
        }, {});

        return this.leftSorted.reduce((sum, left) => sum + (left * amountOfLeftInRightMap[left]), 0);
    }

    get(models: Models): TwoSolutions {
        this.leftSorted = models.map(x => x[0]).sort();
        this.rightSorted = models.map(x => x[1]).sort();

        const partOne = this.partOne();
        const partTwo = this.partTwo();

        return { partOne, partTwo };
        // Part 1: 2192892, Part 2: 22962826
    }
}

