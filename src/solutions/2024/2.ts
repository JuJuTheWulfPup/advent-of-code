import { Solution, TwoSolutions } from 'types/Solution';

type Models = number[][];

export class MySolution implements Solution {
    parseLinesToModels(lines: string[]): Models {
        return lines.map(line => line.split(' ').map(value => Number(value)));
    }

    isUnsafeTransition(shouldBeIncreasing: boolean, value: number, previousValue: number): boolean {
        const difference = value - previousValue;
        const isIncreasing = difference > 0;

        return (shouldBeIncreasing && !isIncreasing)
                    || (!shouldBeIncreasing && isIncreasing)
                    || !(Math.abs(difference) >= 1 && Math.abs(difference) <= 3);
    }

    calculateIsRowSafe(row: number[]): boolean {
        let shouldBeIncreasing = false;
        for (let i = 0; i < row.length; i++) {
            if (i === 0) { continue; }

            const value = row[i];
            const previousValue = row[i - 1];
            if (i === 1) { shouldBeIncreasing = (value - previousValue) > 0; }

            if (this.isUnsafeTransition(shouldBeIncreasing, value, previousValue)) {
                return false;
            }
        }
        return true;
    }

    calculateIsSafeList(models: Models): boolean[] {
        return models.map(row => this.calculateIsRowSafe(row));
    }

    calculateIsSafeWithOneBadLevelTolerance(models: Models): boolean[] {
        return models.map(row => {
            if (this.calculateIsRowSafe(row)) {
                return true;
            }

            // loop over all options of removing one value in search of a safe option
            for (let i = 0; i < row.length; i++) {
                const rowWithRemovedValue = [...row.slice(0, i), ...row.slice(i + 1)];
                if (this.calculateIsRowSafe(rowWithRemovedValue)) {
                    return true;
                }
            }
            return false;
        });
    }

    partOne(models: Models): number {
        return this.calculateIsSafeList(models).filter(isSafe => isSafe).length;
    }

    partTwo(models: Models): number {
        return this.calculateIsSafeWithOneBadLevelTolerance(models).filter(isSafe => isSafe).length;
    }

    get(models: Models): TwoSolutions {
        return { partOne: this.partOne(models), partTwo: this.partTwo(models) };
        // Part 1: 224, Part 2: 293 is too high
    }
}
