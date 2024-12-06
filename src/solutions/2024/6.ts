import { Solution, TwoSolutions } from 'types/Solution';

type Coordinate = number[];
type Models = {
    map: string[][];
    start: Coordinate;
};

export class MySolution implements Solution {
    parseLinesToModels(lines: string[]): Models {
        let start: Coordinate = [];
        const map: string[][] = [];
        for (let x = 0; x < lines.length; x++) {
            const line = lines[x];
            map.push(line.split(''));
            for (let y = 0; y < map[x].length; y++) {
                if (['^', '>', 'v', '<'].includes(map[x][y])) {
                    start = [x, y];
                }
            }
        }

        return { map, start };
    }

    traverseTurningClockwise(map: string[][], start: Coordinate): number {
        let x = start[0];
        let y = start[1];
        while (
            !(x <= 0 && map[x][y] === '^')
            && !(x >= map.length - 1 && map[x][y] === 'v')
            && !(y <= 0 && map[x][y] === '<')
            && !(y >= map[x].length - 1 && map[x][y] === '>')
        ) {
            switch (map[x][y]) {
                case '^':
                    if (map[x - 1][y] === '#') {
                        map[x][y] = 'X';
                        map[x][y + 1] = '>';
                        y++;
                    } else {
                        map[x][y] = 'X';
                        map[x - 1][y] = '^';
                        x--;
                    }
                    break;
                case 'v':
                    if (map[x + 1][y] === '#') {
                        map[x][y] = 'X';
                        map[x][y - 1] = '<';
                        map[x][y] = 'X';
                        y--;
                    } else {
                        map[x][y] = 'X';
                        map[x + 1][y] = 'v';
                        map[x][y] = 'X';
                        x++;
                    }
                    break;
                case '<':
                    if (map[x][y - 1] === '#') {
                        map[x][y] = 'X';
                        map[x - 1][y] = '^';
                        map[x][y] = 'X';
                        x--;
                    } else {
                        map[x][y] = 'X';
                        map[x][y - 1] = '<';
                        y--;
                    }
                    break;
                case '>':
                    if (map[x][y + 1] === '#') {
                        map[x][y] = 'X';
                        map[x + 1][y] = 'v';
                        x++;
                    } else {
                        map[x][y] = 'X';
                        map[x][y + 1] = '>';
                        y++;
                    }
                    break;
                default:
                    break;
            }
        }
        map[x][y] = 'X';
        return (map.map(row => row.join('')).join('')).match(/X/g)?.length ?? 0;
    }

    partOne(map: string[][], start: Coordinate): number {
        return this.traverseTurningClockwise(map, start);
    }

    // partTwo(map: string[][], start: Coordinate): number {

    // }

    get(models: Models): TwoSolutions {
        return { partOne: this.partOne(models.map, models.start), partTwo: -1 }; // Part 1: 5312, Part 2:
    }
}
