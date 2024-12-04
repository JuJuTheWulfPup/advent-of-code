import { Solution, TwoSolutions } from 'types/Solution';

type numberPairs = number[][];
type Models = {
    productPairs: numberPairs;
    enabledProductPairs: numberPairs;
};

export class MySolution implements Solution {
    convertStringCSVToNumberArray(stringPairs: string[]): numberPairs {
        return stringPairs.map(match => match.slice(4, match.length - 1).split(',').map(stringValue => Number(stringValue)));
    }

    parseLinesToModels(lines: string[]): Models {
        const productMatches: string[] = [];
        const enabledProductMatches: string[] = [];
        let enabled = true;
        for (const line of lines) {
            // eslint-disable-next-line spellcheck/spell-checker
            const lineRegexMatches = line.matchAll(/(mul\(\d+,\d+\))|(do(n't)?\(\))/g);
            for (const lineRegexMatch of lineRegexMatches) {
                const lineMatch = lineRegexMatch[0];
                switch (lineMatch.slice(0, 3)) {
                    // eslint-disable-next-line spellcheck/spell-checker
                    case 'mul':
                        productMatches.push(lineMatch);
                        if (enabled) {
                            enabledProductMatches.push(lineMatch);
                        }
                        break;
                    case 'do(':
                        enabled = true;
                        break;
                    case 'don':
                        enabled = false;
                        break;
                    default:
                        throw new Error('unhandled case found');
                        break;
                }
            }
        }
        const productPairs: numberPairs = this.convertStringCSVToNumberArray(productMatches);
        const enabledProductPairs: numberPairs = this.convertStringCSVToNumberArray(enabledProductMatches);
        return {
            productPairs,
            enabledProductPairs
        };
    }

    sumOfProducts(productPairs: numberPairs): number {
        return productPairs.reduce((sumOfProducts, pair) => sumOfProducts + (pair[0] * pair[1]), 0);
    }

    partOne(productPairs: numberPairs): number {
        return this.sumOfProducts(productPairs);
    }

    partTwo(enabledProductPairs: numberPairs): number {
        return this.sumOfProducts(enabledProductPairs);
    }

    get(models: Models): TwoSolutions {
        return { partOne: this.partOne(models.productPairs), partTwo: this.partTwo(models.enabledProductPairs) }; // Part 1: 157621318, Part 2: 79845780
    }
}
