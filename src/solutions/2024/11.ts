
import { Solution, TwoSolutions } from 'types/Solution';

type Stone = number;
type Stones = number[];
type Models = {
    stones: Stones;
};

type Cache = {
    [stone: Stone]: {
        [iterationsLeft: number]: bigint;
    };
};
const cache: Cache = {};

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

    partOne(stones: Stones, iterations: number): number {
        let updatedStones: Stones = [...stones];
        for (let i = 0; i < iterations; i++) {
            updatedStones = updatedStones.flatMap(stone => this.applyRules(stone));
        }
        return updatedStones.length;
    }

    applyRulesWithCacheRecursive(stones: Stones, iterationsLeft: number, maxIterations: number, debug = false): bigint {
        let parentCount = BigInt(0);
        for (let s = 0; s < stones.length; s++) {
            const stone = stones[s];
            if (!cache[stone]) {
                cache[stone] = [];
            }
            const stoneCache = cache[stone];
            const cachedCount = stoneCache[iterationsLeft];

            if (iterationsLeft <= 0) {
                parentCount++;
                continue;
            }

            if (cachedCount) {
                // found perfect cache entry, skip all computation
                parentCount += cachedCount;
                continue;
            }

            const childStones = this.applyRules(stone);
            const childrenCount: bigint = this.applyRulesWithCacheRecursive(childStones, iterationsLeft - 1, maxIterations, debug);

            cache[stone][iterationsLeft] = childrenCount;

            parentCount += childrenCount;
        }
        return parentCount;
    }

    partTwo(stones: Stones): BigInt {
        return this.applyRulesWithCacheRecursive(stones, 75, 75);
    }

    get(models: Models): TwoSolutions {
        return {
            partOne: this.partOne(models.stones, 25),
            partTwo: this.partTwo(models.stones)
        };
        // Part 1: 235850, Part 2: 279903140844645
    }
}
