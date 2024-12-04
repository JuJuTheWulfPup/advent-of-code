import { Solution, TwoSolutions } from 'types/Solution';

type WordSearchGrid = string[][];
type Models = { wordSearch: WordSearchGrid };

export class MySolution implements Solution {
    parseLinesToModels(lines: string[]): Models {
        return {
            wordSearch: lines.map(line => line.split(''))
        };
    }

    lookForWordStartingAt(wordSearch: WordSearchGrid, wordCharList: string[], x: number, y: number): number {
        const up = x - wordCharList.length + 1 >= 0;
        const down = x + wordCharList.length <= wordSearch.length;
        const left = y - wordCharList.length + 1 >= 0;
        const right = y + wordCharList.length <= wordSearch[0].length;
        let wordsFound = 0;

        if (left) {
            wordsFound++;
            for (let i = 0; i < 4; i++) {
                if (wordCharList[i] !== wordSearch[x][y - i]) {
                    wordsFound--;
                    break;
                }
            }
        }
        if (right) {
            wordsFound++;
            for (let i = 0; i < 4; i++) {
                if (wordCharList[i] !== wordSearch[x][y + i]) {
                    wordsFound--;
                    break;
                }
            }
        }

        if (up) {
            wordsFound++;
            for (let i = 0; i < 4; i++) {
                if (wordCharList[i] !== wordSearch[x - i][y]) {
                    wordsFound--;
                    break;
                }
            }
        }
        if (down) {
            wordsFound++;
            for (let i = 0; i < 4; i++) {
                if (wordCharList[i] !== wordSearch[x + i][y]) {
                    wordsFound--;
                    break;
                }
            }
        }

        if (up && left) {
            wordsFound++;
            for (let i = 0; i < 4; i++) {
                if (wordCharList[i] !== wordSearch[x - i][y - i]) {
                    wordsFound--;
                    break;
                }
            }
        }
        if (up && right) {
            wordsFound++;
            for (let i = 0; i < 4; i++) {
                if (wordCharList[i] !== wordSearch[x - i][y + i]) {
                    wordsFound--;
                    break;
                }
            }
        }
        if (down && left) {
            wordsFound++;
            for (let i = 0; i < 4; i++) {
                if (wordCharList[i] !== wordSearch[x + i][y - i]) {
                    wordsFound--;
                    break;
                }
            }
        }
        if (down && right) {
            wordsFound++;
            for (let i = 0; i < 4; i++) {
                if (wordCharList[i] !== wordSearch[x + i][y + i]) {
                    wordsFound--;
                    break;
                }
            }
        }

        return wordsFound;
    }

    lookForXWordStartingAt(wordSearchGrid: WordSearchGrid, word: string[], xCoordinate: number, yCoordinate: number): number {
        /**
         * (M) S
         *    A
         *  M  S
         */
        function foundLeftXWordStartingAt(wordSearch: WordSearchGrid, wordCharList: string[], x: number, y: number): boolean {
            if (
                wordCharList[0] !== wordSearch[x][y]
            || wordCharList[0] !== wordSearch[x + 2][y]

            || wordCharList[1] !== wordSearch[x + 1][y + 1]

            || wordCharList[2] !== wordSearch[x][y + 2]
            || wordCharList[2] !== wordSearch[x + 2][y + 2]
            ) {
                return false;
            }
            return true;
        }

        /**
         * S (M)
         *  A
         * S  M
         */
        function foundRightXWordStartingAt(wordSearch: WordSearchGrid, wordCharList: string[], x: number, y: number): boolean {
            if (
                wordCharList[0] !== wordSearch[x][y]
            || wordCharList[0] !== wordSearch[x + 2][y]

            || wordCharList[1] !== wordSearch[x + 1][y - 1]

            || wordCharList[2] !== wordSearch[x][y - 2]
            || wordCharList[2] !== wordSearch[x + 2][y - 2]
            ) {
                return false;
            }
            return true;
        }

        /**
         * (M) M
         *    A
         *  S  S
         */
        function foundDownXWordStartingAt(wordSearch: WordSearchGrid, wordCharList: string[], x: number, y: number): boolean {
            if (
                wordCharList[0] !== wordSearch[x][y]
            || wordCharList[0] !== wordSearch[x][y + 2]

            || wordCharList[1] !== wordSearch[x + 1][y + 1]

            || wordCharList[2] !== wordSearch[x + 2][y]
            || wordCharList[2] !== wordSearch[x + 2][y + 2]
            ) {
                return false;
            }
            return true;
        }

        /**
         *  S  S
         *    A
         * (M) M
         */
        function foundUpXWordStartingAt(wordSearch: WordSearchGrid, wordCharList: string[], x: number, y: number): boolean {
            if (
                wordCharList[0] !== wordSearch[x][y]
            || wordCharList[0] !== wordSearch[x][y + 2]

            || wordCharList[1] !== wordSearch[x - 1][y + 1]

            || wordCharList[2] !== wordSearch[x - 2][y]
            || wordCharList[2] !== wordSearch[x - 2][y + 2]
            ) {
                return false;
            }
            return true;
        }

        const up = xCoordinate - word.length + 1 >= 0;
        const down = xCoordinate + word.length <= wordSearchGrid.length;
        const left = yCoordinate - word.length + 1 >= 0;
        const right = yCoordinate + word.length <= wordSearchGrid[0].length;
        let wordsFound = 0;

        if (right && down) {
            if (foundLeftXWordStartingAt(wordSearchGrid, word, xCoordinate, yCoordinate)) {
                wordsFound++;
            }
            if (foundDownXWordStartingAt(wordSearchGrid, word, xCoordinate, yCoordinate)) {
                wordsFound++;
            }
        }
        if (left && down) {
            if (foundRightXWordStartingAt(wordSearchGrid, word, xCoordinate, yCoordinate)) {
                wordsFound++;
            }
        }
        if (right && up) {
            if (foundUpXWordStartingAt(wordSearchGrid, word, xCoordinate, yCoordinate)) {
                wordsFound++;
            }
        }

        return wordsFound;
    }

    searchForWord(wordSearch: WordSearchGrid, wordCharList: string[], searchFunction: (wordSearch: WordSearchGrid, wordCharList: string[], x: number, y: number) => number): number {
        let wordsFound = 0;
        wordSearch.forEach((row, x) => {
            row.forEach((character, y) => {
                if (character === wordCharList[0]) {
                    wordsFound += searchFunction(wordSearch, wordCharList, x, y);
                }
            });
        });
        return wordsFound;
    }

    partOne(wordSearch: WordSearchGrid): number {
        return this.searchForWord(wordSearch, ['X', 'M', 'A', 'S'], this.lookForWordStartingAt);
    }

    partTwo(wordSearch: WordSearchGrid): number {
        return this.searchForWord(wordSearch, ['M', 'A', 'S'], this.lookForXWordStartingAt);
    }

    get(models: Models): TwoSolutions {
        return { partOne: this.partOne(models.wordSearch), partTwo: this.partTwo(models.wordSearch) }; // Part 1: 2434, Part 2: 1835
    }
}
