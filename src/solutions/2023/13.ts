import { Solution, TwoSolutions } from 'types/Solution';

type Grid = string[][];
type Models = { grids: Grid[] };
type Coordinate = number[];
type Mismatch = { [key: number]: Coordinate[][] };

export class MySolution implements Solution {
    // printGrid(grid: Grid): void {
    //     grid.forEach(row => {
    //         console.log(row.join(''));
    //     });
    // }

    // printMismatch(mismatch: Mismatch): void {
    //     Object.keys(mismatch).forEach(key => {
    //         console.log(`${key}:`);
    //         mismatch[key].forEach(coordinatePair => {
    //             console.log(`  [ [${coordinatePair[0]}], [${coordinatePair[1]}] ],`);
    //         });
    //     });
    // }

    findExistingReflection(grid: Grid): { verticalAxes: number[]; horizontalAxes: number[] } {
        // this.printGrid(grid);
        let yAxes = Array.from({ length: grid[0].length - 1 }, (_, i) => i + 0.5);
        let xAxes = Array.from({ length: grid.length - 1 }, (_, i) => i + 0.5);
        // console.log('vertical  ', yAxes, '\nhorizontal', xAxes);

        for (let y = 0; y < grid.length; y++) {
            // console.log('(y,x)');
            for (let x = 0; x < grid[y].length; x++) {
                const char = grid[y][x];
                // console.log(`(${y},${x}) = ${char}`);
                const yAxesToRemove: number[] = [];
                for (let i = 0; i < yAxes.length; i++) {
                    // if (i === 0) { console.log('    _ _ (y,x)               | mirror'); }
                    const yAxis = yAxes[i];
                    const reflectionDistance = 2 * Math.abs(yAxis - x);
                    const xReflected = x + (x < yAxis ? reflectionDistance : -reflectionDistance);
                    if (xReflected >= grid[y].length || xReflected < 0) {
                        // console.log(`              - skip   v ${yAxis}`);
                        continue;
                    }
                    const xReflectedChar = grid[y][xReflected];
                    if (char !== xReflectedChar) {
                        // console.log(`    ${char} ${xReflectedChar} (${y},${xReflected}) - remove v ${yAxis}`);
                        yAxesToRemove.push(yAxis);
                        continue;
                    }
                    // console.log(`    ${char} ${xReflectedChar} (${y},${xReflected}) - keep   v ${yAxis}`);
                }
                yAxes = yAxes.filter(axis => !yAxesToRemove.includes(axis));

                const xAxesToRemove: number[] = [];
                for (let i = 0; i < xAxes.length; i++) {
                    // if (i === 0) { console.log('    _ _ (y,x)               -- mirror'); }
                    const xAxis = xAxes[i];
                    const reflectionDistance = 2 * Math.abs(xAxis - y);
                    const yReflected = y + (y < xAxis ? reflectionDistance : -reflectionDistance);
                    if (yReflected >= grid.length || yReflected < 0) {
                        // console.log(`              - skip   h ${xAxis}`);
                        continue;
                    }
                    // console.log(this.printGrid(grid), `(${yReflected},${x})`);
                    const yReflectedChar = grid[yReflected][x];
                    if (char !== yReflectedChar) {
                        // console.log(`    ${char} ${yReflectedChar} (${yReflected},${x}) - remove h ${xAxis}`);
                        xAxesToRemove.push(xAxis);
                        continue;
                    }
                    // console.log(`    ${char} ${yReflectedChar} (${yReflected},${x}) - keep   h ${xAxis}`);
                }
                xAxes = xAxes.filter(axis => !xAxesToRemove.includes(axis));
            }
        }
        return { verticalAxes: [...yAxes], horizontalAxes: [...xAxes] };
    }

    findSmudgeReflection(grid: Grid): { verticalSmudgeAxes: number[]; horizontalSmudgeAxes: number[] } {
        // this.printGrid(grid);
        const yAxes = Array.from({ length: grid[0].length - 1 }, (_, i) => i + 0.5);
        const xAxes = Array.from({ length: grid.length - 1 }, (_, i) => i + 0.5);
        let ySmudgeReflectionAxes: number[] = [];
        let xSmudgeReflectionAxes: number[] = [];
        // console.log('vertical  ', yAxes, '\nhorizontal', xAxes);

        const yReflectionLineMismatches: Mismatch = {};
        const xReflectionLineMismatches: Mismatch = {};

        for (let y = 0; y < grid.length; y++) {
            // console.log('(y,x)');
            for (let x = 0; x < grid[y].length; x++) {
                const char = grid[y][x];
                // console.log(`(${y},${x}) = ${char}`);
                for (let i = 0; i < yAxes.length; i++) {
                    // if (i === 0) { console.log('    _ _ (y,x)               | mirror'); }
                    const yAxis = yAxes[i];
                    const reflectionDistance = 2 * Math.abs(yAxis - x);
                    const xReflected = x + (x < yAxis ? reflectionDistance : -reflectionDistance);
                    if (xReflected >= grid[y].length || xReflected < 0) {
                        // console.log(`              - skip   v ${yAxis}`);
                        continue;
                    }
                    const xReflectedChar = grid[y][xReflected];
                    if (char !== xReflectedChar) {
                        // console.log(`    ${char} ${xReflectedChar} (${y},${xReflected}) - save mismatch v ${yAxis}`);
                        if (!yReflectionLineMismatches[yAxis]) {
                            yReflectionLineMismatches[yAxis] = [];
                        }
                        yReflectionLineMismatches[yAxis].push([[y, x], [y, xReflected]]);
                        continue;
                    }
                    // console.log(`    ${char} ${xReflectedChar} (${y},${xReflected}) -         match v ${yAxis}`);
                }
                ySmudgeReflectionAxes = Object.keys(yReflectionLineMismatches)
                    .filter(axis => {
                        const coordinatePairList: Coordinate[][] = yReflectionLineMismatches[axis];
                        return coordinatePairList.length === 2; // each mismatch comes back in the forward and backward direction
                    }).map(key => Number(key));

                for (let i = 0; i < xAxes.length; i++) {
                    // if (i === 0) { console.log('    _ _ (y,x)               -- mirror'); }
                    const xAxis = xAxes[i];
                    const reflectionDistance = 2 * Math.abs(xAxis - y);
                    const yReflected = y + (y < xAxis ? reflectionDistance : -reflectionDistance);
                    if (yReflected >= grid.length || yReflected < 0) {
                        // console.log(`              - skip   h ${xAxis}`);
                        continue;
                    }
                    const yReflectedChar = grid[yReflected][x];
                    if (char !== yReflectedChar) {
                        // console.log('mismatch before', xReflectionLineMismatches);
                        // console.log(`    ${char} ${yReflectedChar} (${yReflected},${x}) - save mismatch h ${xAxis}`);
                        if (!xReflectionLineMismatches[xAxis]) {
                            xReflectionLineMismatches[xAxis] = [];
                        }
                        // if (!xReflectionLineMismatches[xAxis].includes([[yReflected, x], [y, x]])) {
                        xReflectionLineMismatches[xAxis].push([[y, x], [yReflected, x]]);
                        //     // console.log('mismatch after ', xReflectionLineMismatches);
                        //     continue;
                        // }
                    }
                    // console.log(`    ${char} ${yReflectedChar} (${yReflected},${x}) - keep   h ${xAxis}`);
                }
                // console.log('all mismatches');
                // this.printMismatch(xReflectionLineMismatches);
                xSmudgeReflectionAxes = Object.keys(xReflectionLineMismatches)
                    .filter(axis => {
                        const coordinatePairList: Coordinate[][] = xReflectionLineMismatches[axis];
                        return coordinatePairList.length === 2; // each mismatch comes back in the forward and backward direction
                    }).map(key => Number(key));
            }
        }
        // console.log(this.printGrid(grid));
        return { verticalSmudgeAxes: [...ySmudgeReflectionAxes], horizontalSmudgeAxes: [...xSmudgeReflectionAxes] };
    }

    calculatePoints(verticalAxes: number[], horizontalAxes: number[]): number {
        return 0
            + verticalAxes.reduce((previous, current) => previous + (current + 0.5), 0)
            + horizontalAxes.reduce((previous, current) => previous + (current + 0.5) * 100, 0);
    }

    parseLinesToModels(lines: string[]): Models {
        const grids: Grid[] = [];
        let grid: Grid = [];
        let yStart = 0;
        for (let y = 0; y < lines.length; y++) {
            const line = lines[y];
            if (line.trim().length <= 0) {
                grids.push([...grid]);
                grid = [];
                yStart = y + 1;
                continue;
            }

            const row: string[] = [];
            for (let x = 0; x < line.length; x++) {
                row[x] = line[x];
            }
            grid[y - yStart] = row;
        }
        grids.push(grid);

        return { grids };
    }

    get(models: Models): TwoSolutions {
        const grids = models.grids;

        const allVerticalMirrors: number[] = [];
        const allHorizontalMirrors: number[] = [];
        const allVerticalSmudgeMirrors: number[] = [];
        const allHorizontalSmudgeMirrors: number[] = [];
        for (let i = 0; i < grids.length; i++) {
            const { verticalAxes, horizontalAxes } = this.findExistingReflection(grids[i]);
            if (verticalAxes.length > 0) {
                allVerticalMirrors.push(verticalAxes[0] ?? 0);
            }
            if (horizontalAxes.length > 0) {
                allHorizontalMirrors.push(horizontalAxes[0] ?? 0);
            }

            const { verticalSmudgeAxes, horizontalSmudgeAxes } = this.findSmudgeReflection(grids[i]);
            verticalSmudgeAxes.filter(axis => !verticalAxes.includes(axis));
            horizontalSmudgeAxes.filter(axis => !horizontalAxes.includes(axis));
            if (verticalSmudgeAxes.length > 0) {
                allVerticalSmudgeMirrors.push(verticalSmudgeAxes[0] ?? 0);
            }
            if (horizontalSmudgeAxes.length > 0) {
                allHorizontalSmudgeMirrors.push(horizontalSmudgeAxes[0] ?? 0);
            }

            // if ((verticalSmudgeAxes.length !== 1 && verticalSmudgeAxes.length !== 1)) {
            //     console.log('vertical', verticalAxes, 'horizontal', horizontalAxes, 'verticalSmudge', verticalSmudgeAxes, 'horizontalSmudge', horizontalSmudgeAxes);
            // }
        }

        const partOne = this.calculatePoints(allVerticalMirrors, allHorizontalMirrors);
        const partTwo = this.calculatePoints(allVerticalSmudgeMirrors, allHorizontalSmudgeMirrors);

        return { partOne, partTwo: partTwo }; // Part 1: 31739, Part 2: 31539
    }
}
