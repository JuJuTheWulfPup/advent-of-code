import { readdirSync } from 'node:fs';
import { SolutionRunner } from './SolutionRunner.service';
import { ArgumentParser } from './ArgumentParser.service';
import { SupportedArguments } from '../types/SupportedArguments';
import { YEAR_SOLUTIONS_PATH } from '../constants/Directories';
import { Injectable } from '@nestjs/common';

// todo: replace console.log with ConsoleLogger methods
// todo: add support for the verbose argument, and hide stack traces when not enabled

@Injectable()
export class ProgramRunner {
    constructor(private solutionRunner: SolutionRunner) {}

    public run(): void {
        const args: SupportedArguments = ArgumentParser.getAndValidateArguments();
        const { year, day } = args;
        console.log(`Running Advent of Code ${year} solution${day ? ` for day ${day}.` : 's for all existing days.'}`);
        const yearSolutionPath = YEAR_SOLUTIONS_PATH(year);

        let days: number[];
        if (day) {
            days = [day];
        } else {
            days = readdirSync(yearSolutionPath).map(fileName => Number(fileName.split('.')[0]));
        }

        this.solutionRunner.execute(
            year,
            days,
            process.argv.includes('-e') || process.argv.includes('--example')
        );
    }
}
