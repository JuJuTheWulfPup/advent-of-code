import { Injectable } from '@nestjs/common';
import { YEAR_EXAMPLE_INPUTS_PATH, YEAR_INPUTS_PATH, YEAR_SOLUTIONS_PATH } from '../constants/Directories';
import { ConsoleLoggerService } from './ConsoleLogger.service';
import { readFileSync, readdirSync } from 'fs';

const ROOT = '../../';

@Injectable()
export class SolutionRunner {
    constructor(private consoleLoggerService: ConsoleLoggerService) {}

    public execute(year: number, days: number[], useExampleInput = false): void {
        const yearInputPath = useExampleInput ? YEAR_EXAMPLE_INPUTS_PATH(year) : YEAR_INPUTS_PATH(year);
        const yearDirContents = readdirSync(yearInputPath);

        console.log(`Looping over days: ${days}`);
        this.consoleLoggerService.log(`Looping over days: ${days}`);
        days.forEach(async day => {
            console.log(`Day ${day}:`);

            let inputFilePaths: string[];
            if (yearDirContents.includes(`${day}.txt`)) {
                inputFilePaths = [`${yearInputPath}/${day}.txt`];
            } else if (yearDirContents.includes(`${day}`)) {
                const dayInputFilePath = `${yearInputPath}/${day}`;
                inputFilePaths = readdirSync(dayInputFilePath).filter(fileName => fileName.endsWith('.txt')).map(fileName => `${dayInputFilePath}/${fileName}`);
            } else {
                throw Error('Something went wrong when finding input files.');
            }
            console.log(`Input file paths: ${inputFilePaths}`);

            for (let i = 0; i < inputFilePaths.length; i++) {
                const inputFilePath = inputFilePaths[i];

                console.log(`Reading ${inputFilePath}...`);
                const input = readFileSync(inputFilePath, { encoding: 'utf8' });
                const inputLines = input.split('\n');

                const fullSolutionFilePath = `${ROOT}${YEAR_SOLUTIONS_PATH(year)}/${day}.ts`;
                console.log(`Importing ${fullSolutionFilePath}...`);
                // eslint-disable-next-line no-await-in-loop
                const { MySolution } = await import(fullSolutionFilePath);

                const solution = new MySolution();
                const solutions: { partOne: number; partTwo: number } = solution.get(solution.parseLinesToModels(inputLines));
                console.log(`Part 1: ${solutions.partOne}, Part 2: ${solutions.partTwo}`);
            }
        });
    }
}
