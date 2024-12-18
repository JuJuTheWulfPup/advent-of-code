import { Solution, TwoSolutions } from 'types/Solution';

type Memory = string[][];
type Coordinate = {
    x: number;
    y: number;
};
type Models = {
    memory: Memory;
    fallingBytes: Coordinate[];
};

let memory: Memory;
const memoryRange = 70;
const corruptedBytes = 1024;
// const memoryRange = 6;
// const corruptedBytes = 12;

const directions: Coordinate[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 }
];

export class MySolution implements Solution {
    generateEmptyMemory(): Memory {
        const emptyMemory: Memory = [];
        const emptyRow: string[] = [];
        for (let x = 0; x <= memoryRange; x++) {
            emptyRow.push('.');
        }
        for (let i = 0; i <= memoryRange; i++) {
            emptyMemory.push([...emptyRow]);
        }
        return emptyMemory;
    }

    parseLinesToModels(lines: string[]): Models {
        return {
            fallingBytes: lines.map(line => {
                const values = line.split(',');
                return {
                    x: Number(values[0]),
                    y: Number(values[1])
                };
            }),
            memory: this.generateEmptyMemory()
        };
    }

    mapMemoryCorruption(corruptThisMemory: Memory, fallingBytes: Coordinate[]): Memory {
        fallingBytes.forEach(fallingByte => {
            corruptThisMemory[fallingByte.y][fallingByte.x] = '#';
        });
        return corruptThisMemory;
    }

    copyMemory(): Memory {
        const newMemory: Memory = [];
        for (let y = 0; y < memory.length; y++) {
            const row = memory[y];
            const newRow: string[] = [];
            for (let x = 0; x < row.length; x++) {
                const item = row[x];
                newRow.push(item);
            }
            newMemory.push(newRow);
        }
        return newMemory;
    }

    /* depth-first search */
    getShortestPath(start: Coordinate, end: Coordinate): Coordinate[] {
        let searchQueue: {
            path: Coordinate[];
            location: Coordinate;
        }[] = [{
            path: [],
            location: start
        }];
        const memoryCopy = this.copyMemory();

        while (searchQueue.length > 0) {
            const search = searchQueue[0];
            searchQueue = searchQueue.slice(1);
            const location = search?.location;
            if (!location) {
                continue;
            }
            const memoryLocation = memoryCopy[location.y][location.x];
            if (memoryLocation !== 'V' && memoryLocation !== '#') {
                memoryCopy[location.y][location.x] = 'V';

                const newPath = [...search.path, { x: location.x, y: location.y }];

                if (location.x === end.x && location.y === end.y) {
                    return newPath;
                }

                for (let d = 0; d < directions.length; d++) {
                    const direction = directions[d];
                    const newLocation = {
                        x: location.x + direction.x,
                        y: location.y + direction.y
                    };
                    if (newLocation.x >= 0 && newLocation.x < memory.length
                        && newLocation.y >= 0 && newLocation.y < memoryCopy[0].length
                    ) {
                        searchQueue.push({
                            path: newPath,
                            location: newLocation
                        });
                    }
                }
            }
        }
        return [];
    }

    getShortestPathThroughCorruption(/* fallingBytes: Coordinate[] */): Coordinate[] {
        const shortestPath = this.getShortestPath({ x: 0, y: 0 }, { x: memoryRange, y: memoryRange });
        // const pathMemory = this.generateEmptyMemory();
        // for (let i = 0; i < shortestPath.length; i++) {
        //     const location = shortestPath[i];
        //     pathMemory[location.y][location.x] = 'O';
        // }
        // this.printMemory(this.mapMemoryCorruption(pathMemory, fallingBytes.slice(0, corruptedBytes)));
        // console.log(shortestPath);
        return shortestPath;
    }

    // printMemory(printMemory: Memory): void {
    //     console.log(printMemory.map(y => y.join('')).join('\n'));
    // }

    solvePartOneAndTwo(fallingBytes: Coordinate[]): { partOne: number; partTwo: Coordinate } {
        const partOnePath = this.getShortestPathThroughCorruption();

        // find first falling byte that cuts off the exit
        let path = [...partOnePath];
        let blockingByte: Coordinate = { x: -1, y: -1 };
        for (let f = 0; f < fallingBytes.length; f++) {
            const fallingByte = fallingBytes[f];
            memory[fallingByte.y][fallingByte.x] = '#';

            if (path.find(location => location.x === fallingByte.x && location.y === fallingByte.y)) {
                path = this.getShortestPathThroughCorruption();
                if (path.length === 0) {
                    blockingByte = fallingByte;
                    break;
                }
            }
        }

        return { partOne: partOnePath.length, partTwo: blockingByte };
    }

    get(models: Models): TwoSolutions {
        memory = this.mapMemoryCorruption(models.memory, models.fallingBytes.slice(0, corruptedBytes));
        const { partOne, partTwo } = this.solvePartOneAndTwo(models.fallingBytes);
        return {
            partOne: partOne,
            partTwo: `${partTwo.x},${partTwo.y}`
        };
        // Part 1: 278, Part 2:
    }
}
