
import { Solution, TwoSolutions } from 'types/Solution';

type Stone = number;
type Stones = number[];
/** leaf number is the amount of stones that it turns into at [index] iterations (0 will always be 1), starting from stoneKey */
// type Cache = {
//     [key: Stone]: number;
// };
type Models = {
    stones: Stones;
};

// const cache: Cache = {
//     0: 1,
//     1: 1,
//     2024: 2
// };

export class MySolution implements Solution {
    parseLinesToModels(lines: string[]): Models {
        let stones: Stones = [];
        lines.forEach(line => { stones = line.split(' ').map(x => Number(x)); });
        return {
            stones
        };
    }

    applyRules(stone: Stone): Stones {
        if (stone === 0) { return [1]; }

        const stoneString = stone.toString();
        if (stoneString.length % 2 === 0) {
            const halfLength = stoneString.length / 2;
            return [
                Number(stoneString.slice(0, halfLength)),
                Number(stoneString.slice(halfLength))
            ];
        }

        return [stone * 2024];
    }

    partOne(stones: Stones): Stones {
        let updatedStones: Stones = [...stones];
        for (let i = 0; i < 25; i++) {
            updatedStones = updatedStones.flatMap(stone => this.applyRules(stone));
        }
        return updatedStones;
    }

    // applyRulesRecursive(stone: Stone, iteration: number, maxIterations: number): number {
    //     if (iteration >= maxIterations) {
    //         return 1;
    //     }

    //     return this.applyRules(stone).reduce((sum, newStone) => sum + this.applyRulesRecursive(newStone, iteration + 1, maxIterations), 0);
    // }

    // blink2(stones: Stones, iterations: number): number {
    //     let count = 0;
    //     for (let j = 0; j < stones.length; j++) {
    //         const updatedStones: Stones = [stones[j]];
    //         // for (let i = 0; i < iterations; i++) {
    //         //     updatedStones = updatedStones.flatMap(stone => this.applyRules(stone));
    //         // }
    //         // count += updatedStones.length;
    //         count += this.applyRulesRecursive(stones[j], 0, iterations);
    //     }
    //     return count;
    // }

    // partTwo(stones: Stones): number {
    //     return this.blink2(stones, 75);
    // }

    get(models: Models): TwoSolutions {
        const partOneStones = this.partOne(models.stones);
        const partOneResult = partOneStones.length;
        /* console.log(this.blink2(models.stones, 25)); */
        return { partOne: partOneResult, partTwo: -1 /* this.partTwo(models.stones) */ }; // Part 1: 235850, Part 2:
    }
}
