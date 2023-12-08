
import { InvalidDayException } from './src/exceptions/InvalidDayException';
import { InvalidYearException } from './src/exceptions/InvalidYearException';
import { readFileSync, readdirSync } from 'node:fs';

const SOLUTIONS_PATH = './src/solutions';
const INPUT_PATH = './src/inputs';
// todo: convert these to one of those calculated properties/variables?
function getYearSolutionPath(year: number): string {
    return `${SOLUTIONS_PATH}/${year}`;
}
function getYearInputPath(year: number): string {
    return `${INPUT_PATH}/${year}`;
}

// todo: replace console.log with ConsoleLogger methods
// todo: add support for the verbose argument, and hide stack traces when not enabled
const yearArg = process.argv[2];
const dayArg = process.argv[3];

type SupportedArguments = { year: number; day?: number };

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
    console.log(`Year directories found for validation: ${yearSolutionDirectories} and ${yearInputDirectories}`);
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
        solutionFiles = readdirSync(getYearSolutionPath(year));
        inputFiles = readdirSync(getYearInputPath(year));
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

async function main(): Promise<void> {
    const args = getAndValidateArguments();
    printStartupText(args);
    const { year, day } = args;
    const yearSolutionPath = getYearSolutionPath(year);

    let solutionFileNames: string[];
    if (day) {
        solutionFileNames = [`${day}.ts`];
    } else {
        solutionFileNames = readdirSync(yearSolutionPath);
    }

    console.log(`Looping over day files: ${solutionFileNames}`);
    await Promise.all(solutionFileNames.map(async solutionFileName => {
        console.log(`Start of loop for ${solutionFileName}`);

        const inputFilePath = `${getYearInputPath(year)}/${solutionFileName.split('.')[0]}.txt`;

        console.log(`Reading ${inputFilePath}`);
        const input = readFileSync(inputFilePath, { encoding: 'utf8' });
        // todo: make a new argument to have the ability to run against the example input instead.
        // const input = readFileSync('./exampleInput.txt', { encoding: 'utf8' });
        const inputLines = input.split('\n');

        const solutionFilePath = `${yearSolutionPath}/${solutionFileName}`;
        console.log(`Importing ${solutionFilePath}`);
        const { ThisSolution } = await import(solutionFilePath);
        const solution = new ThisSolution();
        solution.get(solution.parseLinesToModels(inputLines));
    }));
}

main();
