import { Solution, TwoSolutions } from 'types/Solution';

type Models = { grid: Grid };
type Grid = string[][];
type Position = { y: number; x: number };
type Direction = 'north' | 'east' | 'south' | 'west';

export class MySolution implements Solution {

    parseLinesToModels(lines: string[]): Models {
        const grid: Grid = [];
        lines.forEach(line => {
            const gridLine: string[] = [];
            for (let i = 0; i < line.length; i++) {
                const char = line.charAt(i);
                gridLine.push(char);
            }
            grid.push(gridLine);
        });
        return { grid };
    }

    getPositionDelta(direction: Direction): Position {
        switch (direction) {
            case 'north':
                return { y: -1, x: 0 };
            case 'east':
                return { y: 0, x: 1 };
            case 'south':
                return { y: 1, x: 0 };
            case 'west':
                return { y: 0, x: -1 };
            default:
                throw Error('Found invalid Direction!');
        }
    }

    moveDirection(position: Position, direction: Direction): Position {
        const delta = this.getPositionDelta(direction);
        const newPosition = {
            y: position.y + delta.y,
            x: position.x + delta.x
        };
        // console.log(`      move ${direction}`, position, delta, newPosition);
        return newPosition;
    }

    findStart(grid: Grid): Position {
        for (let y = 0; y < grid.length; y++) {
            const gridLine = grid[y];
            for (let x = 0; x < gridLine.length; x++) {
                const char = gridLine[x];
                if (char === 'S') {
                    return { y, x };
                }
            }
        }
        throw Error('Starting position not found!');
    }

    getOpposite(direction: Direction): Direction {
        switch (direction) {
            case 'north':
                return 'south';
            case 'east':
                return 'west';
            case 'south':
                return 'north';
            case 'west':
                return 'east';
            default:
                throw Error('Invalid direction found!');
        }
    }

    getConnections(startingPosition: Position, grid: Grid): Direction[] {
        const directions: Direction[] = [];
        if (this.hasConnection(this.moveDirection(startingPosition, 'north'), this.getOpposite('north'), grid)) {
            directions.push('north');
        }
        if (this.hasConnection(this.moveDirection(startingPosition, 'east'), this.getOpposite('east'), grid)) {
            directions.push('east');
        }
        if (this.hasConnection(this.moveDirection(startingPosition, 'south'), this.getOpposite('south'), grid)) {
            directions.push('south');
        }
        if (this.hasConnection(this.moveDirection(startingPosition, 'west'), this.getOpposite('west'), grid)) {
            directions.push('west');
        }
        // console.log('  starting directions', directions);
        return directions;
    }

    hasConnection(position: Position, direction: Direction, grid: Grid): boolean {
        const char = grid[position.y][position.x];
        switch (char) {
            case 'S':
                return this.getConnections(position, grid).includes(direction);
            case '|':
                return direction === 'north' || direction === 'south';
            case '-':
                return direction === 'east' || direction === 'west';
            case 'L':
                return direction === 'north' || direction === 'east';
            case 'J':
                return direction === 'north' || direction === 'west';
            case '7':
                return direction === 'south' || direction === 'west';
            case 'F':
                return direction === 'south' || direction === 'east';
            case '.':
            case undefined:
                return false;
            default:
                throw Error(`Found unimplemented character (${char})!`);
        }
    }

    getPath(startingPosition: Position, grid: Grid): Position[] {
        const pathCoords: Position[] = [];
        let position = { ...startingPosition };
        let possibleDirections = this.getConnections(startingPosition, grid);
        let fromDirection: Direction = possibleDirections[0];
        do {
            // console.log('do-while', position, grid[position.y][position.x], startingPosition);
            possibleDirections = ['north', 'east', 'south', 'west'];
            while (possibleDirections.length > 0) {
                const direction = possibleDirections.pop();
                if (!direction) { throw Error('Possible directions of travel exhausted!'); }
                if (direction === this.getOpposite(fromDirection)) {
                    continue;
                }
                if (this.hasConnection(position, direction, grid)) {
                    // console.log(`    Moving ${direction}`);// , pathCoords);
                    pathCoords.push(position);
                    position = this.moveDirection(position, direction);
                    fromDirection = direction;
                    break;
                }
            }
        } while (position.y !== startingPosition.y || position.x !== startingPosition.x);
        return pathCoords;
    }

    get(models: Models): TwoSolutions {
        const grid = models.grid;
        const startingCoords = this.findStart(grid);
        const pathCoords: Position[] = this.getPath(startingCoords, grid);

        const amtOfStepsHalfway = pathCoords.length / 2;

        const pathOnlyGrid: Grid = [];
        for (let i = 0; i < grid.length; i++) {
            pathOnlyGrid.push(Array(grid[i].length));
        }
        pathCoords.forEach(coords => {
            pathOnlyGrid[coords.y][coords.x] = grid[coords.y][coords.x];
        });

        return { partOne: amtOfStepsHalfway, partTwo: -1 }; // Part 1: 6897, Part 2:
    }
}
