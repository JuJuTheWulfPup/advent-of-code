import { Solution, TwoSolutions } from 'types/Solution';

type Models = string[];

export class MySolution implements Solution {
    parseLinesToModels(lines: string[]): Models {
        return lines;
    }

    reverseString(forwardString: string): string {
        return forwardString.split('').reverse().join('');
    }

    regexMatchFirstAndLastDigits(line: string, forwardRegex: RegExp, backwardRegex: RegExp): { first: string; last: string } {
        const firstMatch = line.match(forwardRegex);
        const lastMatch = this.reverseString(line).match(backwardRegex);
        return {
            first: firstMatch ? firstMatch[0] : '0',
            last: lastMatch ? this.reverseString(lastMatch[0]) : '0'
        };
    }

    numbersMap = {
        one: '1',
        two: '2',
        three: '3',
        four: '4',
        five: '5',
        six: '6',
        seven: '7',
        eight: '8',
        nine: '9'
    };

    sumOfFirstAndLastDigit(lines: string[], isPartTwo = false): number {
        const partOneRegex = /\d/g;
        const partTwoRegex = /\d|one|two|three|four|five|six|seven|eight|nine|zero/g;
        const partTwoBackwardsRegex = /\d|orez|enin|thgie|neves|xis|evif|ruof|eerht|owt|eno/g;
        const forwardRegex = isPartTwo ? partTwoRegex : partOneRegex;
        const backwardRegex = isPartTwo ? partTwoBackwardsRegex : partOneRegex;

        let sum = 0;
        lines.forEach(line => {
            const { first, last } = this.regexMatchFirstAndLastDigits(line, forwardRegex, backwardRegex);
            const firstDigit: string = Object.keys(this.numbersMap).includes(first) ? this.numbersMap[first] : first;
            const lastDigit: string = Object.keys(this.numbersMap).includes(last) ? this.numbersMap[last] : last;
            sum += Number(`${firstDigit}${lastDigit}`);
        });
        return sum;
    }

    get(models: Models): TwoSolutions {
        let partOne = this.sumOfFirstAndLastDigit(models);
        if (partOne <= 0) {
            partOne = -1;
        }

        return {
            partOne,
            partTwo: this.sumOfFirstAndLastDigit(models, true)
        };
        // Part 1: 53386, Part 2: 53312
    }
}

