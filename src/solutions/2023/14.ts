import { Solution, TwoSolutions } from 'types/Solution';

type Coordinate = number[];
type Grid = string[][];
type Models = { grid: Grid };

export class MySolution implements Solution {
    // private printGrid(grid: Grid): void {
    //     grid.forEach(row => {
    //         console.log(row.join(''));
    //     });
    //     console.log();
    // }

    private rollRockNorth(location: Coordinate, grid: Grid): Grid {
        const startY = location[0];
        const x = location[1];
        let newY: number = startY;
        grid[startY][x] = '.';
        for (let y = startY; y >= 0; y--) {
            if (['#', 'O'].includes(grid[y][x])) {
                break;
            }
            newY = y;
        }
        grid[newY][x] = 'O';
        return grid;
    }

    private rollNorth(grid: Grid): Grid {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                const character = grid[y][x];
                if (character === 'O') {
                    grid = this.rollRockNorth([y, x], grid);
                }
            }
        }
        return grid;
    }

    private rollRockEast(location: Coordinate, grid: Grid): Grid {
        const startX = location[1];
        const y = location[0];
        let newX: number = startX;
        grid[y][startX] = '.';
        for (let x = startX; x < grid[0].length; x++) {
            if (['#', 'O'].includes(grid[y][x])) {
                break;
            }
            newX = x;
        }
        grid[y][newX] = 'O';
        return grid;
    }

    private rollEast(grid: Grid): Grid {
        for (let x = grid[0].length - 1; x >= 0; x--) {
            for (let y = 0; y < grid.length; y++) {
                const character = grid[y][x];
                if (character === 'O') {
                    grid = this.rollRockEast([y, x], grid);
                }
            }
        }
        return grid;
    }

    private rollRockSouth(location: Coordinate, grid: Grid): Grid {
        const startY = location[0];
        const x = location[1];
        let newY: number = startY;
        grid[startY][x] = '.';
        for (let y = startY; y < grid.length; y++) {
            if (['#', 'O'].includes(grid[y][x])) {
                break;
            }
            newY = y;
        }
        grid[newY][x] = 'O';
        return grid;
    }

    private rollSouth(grid: Grid): Grid {
        for (let y = grid.length - 1; y >= 0; y--) {
            for (let x = 0; x < grid[y].length; x++) {
                const character = grid[y][x];
                if (character === 'O') {
                    grid = this.rollRockSouth([y, x], grid);
                }
            }
        }
        return grid;
    }

    private rollRockWest(location: Coordinate, grid: Grid): Grid {
        const startX = location[1];
        const y = location[0];
        let newX: number = startX;
        grid[y][startX] = '.';
        for (let x = startX; x >= 0; x--) {
            if (['#', 'O'].includes(grid[y][x])) {
                break;
            }
            newX = x;
        }
        grid[y][newX] = 'O';
        return grid;
    }

    private rollWest(grid: Grid): Grid {
        for (let x = 0; x < grid[0].length; x++) {
            for (let y = 0; y < grid.length; y++) {
                const character = grid[x][y];
                if (character === 'O') {
                    grid = this.rollRockWest([x, y], grid);
                }
            }
        }
        return grid;
    }

    private calculateNorthernLoad(grid: Grid): number {
        let load = 0;
        for (let y = grid.length - 1; y >= 0; y--) {
            const row = grid[y];
            for (let x = 0; x < row.length; x++) {
                const character = row[x];
                if (character === 'O') {
                    load += grid.length - y;
                }
            }
        }
        return load;
    }

    public parseLinesToModels(lines: string[]): Models {
        const grid: Grid = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            grid[i] = line.split('');
        }
        return { grid };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public cloneArray(from: any[]): any[] {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const copy: any[] = from.slice(0);
        for (let i = 0; i < from.length; i++) {
            if (from[i] instanceof Array) {
                copy[i] = this.cloneArray(from[i]);
            }
        }
        return copy;
    }

    public get(models: Models): TwoSolutions {
        let grid: Grid = models.grid;
        const ITERATIONS = 1000000000;
        let partOne = -1;

        const previousGridStates: Grid[] = [];
        let cycleStart = -1;
        let cycleEnd = -1;
        for (let cycle = 0; cycle < ITERATIONS; cycle++) {
            const gridString = JSON.stringify(grid);
            const newCycleStart = previousGridStates.findIndex(previousGrid => JSON.stringify(previousGrid) === gridString);
            if (newCycleStart !== -1) {
                cycleStart = newCycleStart;
                cycleEnd = cycle;
                break;
            }
            previousGridStates.push(this.cloneArray(grid));

            // for (let rollFunctionId = 0; rollFunctionId < rollFunctions.length; rollFunctionId++) {
            // const rollFunction = rollFunctions[rollFunctionId];
            // grid = rollFunction(grid);
            grid = this.rollNorth(grid);
            // console.log('North');
            // this.printGrid(grid);
            if (cycle === 0) {
                partOne = this.calculateNorthernLoad(grid);
                // console.log('part one', partOne);
            }

            grid = this.rollWest(grid);
            // console.log('West');
            // this.printGrid(grid);

            grid = this.rollSouth(grid);
            // console.log('South');
            // this.printGrid(grid);

            grid = this.rollEast(grid);
            // console.log('East, end of cycle', cycle + 1);
            // this.printGrid(grid);
            // }
        }
        const cycleOffset = (ITERATIONS - cycleStart) % (cycleEnd - cycleStart);
        // console.log(cycleEnd, cycleStart, cycleOffset, previousGridStates.length);
        const partTwo = this.calculateNorthernLoad(previousGridStates[cycleStart + cycleOffset]);

        // this.printGrid(grid);
        return { partOne, partTwo: (partTwo === 136 ? -1 : partTwo) }; // Part 1: 108826, Part 2: 99291
    }
}
