import { readdirSync } from 'node:fs';
import { SolutionRunnerService } from './SolutionRunner.service';
import { ArgumentParserService } from './ArgumentParser.service';
import { SupportedArguments } from '../types/SupportedArguments';
import { YEAR_SOLUTIONS_PATH } from '../constants/Directories';
import { Injectable } from '@nestjs/common';
import { ConsoleLoggerService } from './logger/ConsoleLogger.service';
// todo: add support for the verbose argument, and hide error stack traces when not enabled

@Injectable()
export class ProgramRunnerService {
    constructor(
        private argumentParserService: ArgumentParserService,
        private consoleLoggerService: ConsoleLoggerService,
        private solutionRunnerService: SolutionRunnerService
    ) {}

    public run(): void {
        const args: SupportedArguments = this.argumentParserService.getAndValidateArguments();
        const { year, day } = args;
        this.consoleLoggerService.setMostVerboseLogLevel(args.logLevel ?? 'error');

        this.consoleLoggerService.log(`Running Advent of Code ${year} solution${day ? ` for day ${day}.` : 's for all existing days.'}`);
        const yearSolutionPath = YEAR_SOLUTIONS_PATH(year);

        let days: number[];
        if (day) {
            days = [day];
        } else {
            days = readdirSync(yearSolutionPath)
                .map(fileName => Number(fileName.split('.')[0]))
                .filter(dayNumber => !Number.isNaN(dayNumber))
                .sort((a, b) => a - b);
        }

        try {
            this.solutionRunnerService.execute(
                year,
                days,
                process.argv.includes('-e') || process.argv.includes('--example')
            );
        } catch (error) {
            if (typeof error === 'string') {
                this.consoleLoggerService.error(error);
            } else if (error instanceof Error) {
                this.consoleLoggerService.error(error.message);
                if (error.stack) {
                    this.consoleLoggerService.debug(error.stack);
                }
            }
        }
    }
}
