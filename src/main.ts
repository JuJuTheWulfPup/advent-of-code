import { readdirSync } from 'node:fs';
import { INPUT_PATH, SOLUTIONS_PATH, YEAR_INPUT_PATH, YEAR_SOLUTION_PATH } from './constants/Directories';
import { InvalidDayException } from './exceptions/InvalidDayException';
import { InvalidYearException } from './exceptions/InvalidYearException';
import { SolutionRunner } from './services/SolutionRunner.service';

type SupportedArguments = { year: number; day?: number };

// todo: replace console.log with ConsoleLogger methods
// todo: add support for the verbose argument, and hide stack traces when not enabled
const yearArg = process.argv[2];
const dayArg = process.argv[3];

function getAndValidateArguments(): SupportedArguments {
    const year = Number(yearArg);
    if (Number.isNaN(year)) {
        throw new InvalidYearException(yearArg, 'The value was not able to be parsed as a Number.');
    }
    if (Math.round(year) !== year && year < 0) {
        throw new InvalidYearException(yearArg, `The value was parsed as ${year}.`);
    }
    const yearSolutionDirectories = readdirSync(SOLUTIONS_PATH);
    const yearInputDirectories = readdirSync(INPUT_PATH);
    console.log(`Year directories found for validation:\n  solutions: ${yearSolutionDirectories}\n  inputs: ${yearInputDirectories}`);
    if (!yearSolutionDirectories.includes(year.toString()) || !yearInputDirectories.includes(year.toString())) {
        throw new InvalidYearException(yearArg, `Supported values: ${yearSolutionDirectories.filter(x => yearInputDirectories.includes(x)).join(', ')}.`);
    }

    let day: number | undefined;
    let solutionFiles: string[] = [];
    let inputFiles: string[] = [];
    if (dayArg !== undefined) {
        day = Number(dayArg);
        if (Number.isNaN(day)) {
            throw new InvalidDayException('The value was not able to be parsed as a Number.');
        }
        solutionFiles = readdirSync(YEAR_SOLUTION_PATH(year));
        inputFiles = readdirSync(YEAR_INPUT_PATH(year));
        console.log(`Day files found for validation: ${solutionFiles} and ${inputFiles}`);
        if (!solutionFiles.includes(`${day.toString()}.ts`) || !inputFiles.includes(`${day.toString()}.txt`)) {
            throw new InvalidDayException(yearArg, `Supported values: ${solutionFiles.filter(x => inputFiles.includes(`${x.split('.')[0]}.txt`)).map(x => x.split('.')[0]).join(', ')}.`);
        }
    } else {
        day = undefined;
    }

    return { year, day };
}

function printStartupText(args: SupportedArguments): void {
    const startupText = `Running Advent of Code ${args.year} solution${args.day ? ` for day ${args.day}.` : 's for all existing days.'}`;
    console.log(startupText);
}

function main(): void {
    const args = getAndValidateArguments();
    printStartupText(args);
    const { year, day } = args;
    const yearSolutionPath = YEAR_SOLUTION_PATH(year);

    let days: number[];
    if (day) {
        days = [day];
    } else {
        days = readdirSync(yearSolutionPath).map(fileName => Number(fileName.split('.')[0]));
    }

    SolutionRunner.execute(year, days, process.argv.includes('--example') || process.argv.includes('-e'));
}

main();
