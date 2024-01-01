import { Injectable } from '@nestjs/common';
import { YEAR_EXAMPLE_INPUTS_PATH, YEAR_INPUTS_PATH, YEAR_SOLUTIONS_PATH } from '../constants/Directories';
import { ConsoleLoggerService } from './logger/ConsoleLogger.service';
import { readFileSync, readdirSync } from 'fs';

const ROOT = '../../';

@Injectable()
export class SolutionRunnerService {
    constructor(private consoleLoggerService: ConsoleLoggerService) {}

    public async execute(year: number, days: number[], useExampleInput = false): Promise<void> {
        const yearInputPath = useExampleInput ? YEAR_EXAMPLE_INPUTS_PATH(year) : YEAR_INPUTS_PATH(year);
        const yearDirContents = readdirSync(yearInputPath);

        this.consoleLoggerService.verbose(`Looping over days: ${days.join(', ')}`);
        for (let d = 0; d < days.length; d++) {
            const day = days[d];
            this.consoleLoggerService.log(`  Day ${day}:`);

            let inputFilePaths: string[];
            if (yearDirContents.includes(`${day}.txt`)) {
                inputFilePaths = [`${yearInputPath}/${day}.txt`];
            } else if (yearDirContents.includes(`${day}`)) {
                const dayInputFilePath = `${yearInputPath}/${day}`;
                inputFilePaths = readdirSync(dayInputFilePath).filter(fileName => fileName.endsWith('.txt')).map(fileName => `${dayInputFilePath}/${fileName}`);
            } else {
                throw Error('Something went wrong when finding input files.');
            }
            this.consoleLoggerService.verbose(`    Input file paths: ${inputFilePaths}`);

            for (let i = 0; i < inputFilePaths.length; i++) {
                const inputFilePath = inputFilePaths[i];
                if (inputFilePaths.length > 1) {
                    this.consoleLoggerService.log(`    Solution for ${inputFilePath.split('/').pop()}`);
                }

                this.consoleLoggerService.verbose(`    Reading ${inputFilePath}...`);
                const input = readFileSync(inputFilePath, { encoding: 'utf8' });
                const inputLines = input.split('\n');

                const fullSolutionFilePath = `${ROOT}${YEAR_SOLUTIONS_PATH(year)}/${day}.ts`;
                this.consoleLoggerService.verbose(`    Importing ${fullSolutionFilePath}...`);
                // eslint-disable-next-line no-await-in-loop
                const { MySolution } = await import(fullSolutionFilePath);

                const solution = new MySolution();
                const solutions: { partOne: number; partTwo: number } = solution.get(solution.parseLinesToModels(inputLines));
                const partOneText = solutions.partOne === -1 ? 'unsolved' : solutions.partOne.toString();
                const partTwoText = solutions.partTwo === -1 ? 'unsolved' : solutions.partTwo.toString();
                this.consoleLoggerService.log(`    Part 1: ${partOneText}, Part 2: ${partTwoText}`);
            }
        }
    }
}
