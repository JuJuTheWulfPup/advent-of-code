import { Injectable, LogLevel } from '@nestjs/common';
import { readdirSync } from 'fs';
import { LOG_LEVELS } from '../constants/Logging';
import { INPUT_PATH, SOLUTIONS_PATH, YEAR_INPUTS_PATH, YEAR_SOLUTIONS_PATH } from '../constants/Directories';
import { InvalidYearException } from '../exceptions/InvalidYearException';
import { InvalidDayException } from '../exceptions/InvalidDayException';
import { SupportedArguments } from '../types/SupportedArguments';
import { ConsoleLoggerService } from './logger/ConsoleLogger.service';

@Injectable()
export class ArgumentParserService {
    constructor(private consoleLoggerService: ConsoleLoggerService) {}

    /** Searches all given args prefixed with `--` for valid LogLevels, and returns the one that will enable the most logs. */
    private getMostVerboseLogLevel(args: string[]): LogLevel {
        const mostVerboseLogLevelIndex = args.reduce((highestIndex, arg) => {
            if (arg.startsWith('--')) {
                const possibleLogLevelArg = arg.substring(2);
                const index = LOG_LEVELS.findIndex(x => x === possibleLogLevelArg);
                if (index !== -1 && highestIndex < index) {
                    return index;
                }
            }
            return highestIndex;
        }, LOG_LEVELS.length - 1);
        console.log('highest log level index:', mostVerboseLogLevelIndex, LOG_LEVELS[mostVerboseLogLevelIndex]);
        return LOG_LEVELS[mostVerboseLogLevelIndex];
    }

    private getAndValidateYear(yearArg: string): number {
        const yearSolutionDirectories = readdirSync(SOLUTIONS_PATH);
        const yearInputDirectories = readdirSync(INPUT_PATH);
        const supportedYearValues = yearSolutionDirectories.map(yearString => Number(yearString))
            .filter(x => yearInputDirectories.map(yearString => Number(yearString)).includes(x));
        const year = Number(yearArg);

        if (Number.isNaN(year)) {
            throw new InvalidYearException(yearArg, supportedYearValues, 'The value was not able to be parsed as a Number.');
        }
        if (Math.round(year) !== year && year < 0) {
            throw new InvalidYearException(yearArg, supportedYearValues, `The value was parsed as ${year}.`);
        }
        this.consoleLoggerService.verbose(`Year directories found for validation:\n  solutions: ${yearSolutionDirectories}\n  inputs: ${yearInputDirectories}`);
        if (!supportedYearValues.includes(year)) {
            throw new InvalidYearException(yearArg, supportedYearValues);
        }

        return year;
    }

    private getAndValidateDay(dayArg: string, year: number): number | undefined {
        let day: number | undefined;
        let solutionFiles: string[] = [];
        let inputFiles: string[] = [];
        if (dayArg !== undefined) {
            day = Number(dayArg);
            if (Number.isNaN(day)) {
                throw new InvalidDayException('The value was not able to be parsed as a Number.');
            }
            solutionFiles = readdirSync(YEAR_SOLUTIONS_PATH(year));
            inputFiles = readdirSync(YEAR_INPUTS_PATH(year));
            this.consoleLoggerService.debug(`Day files found for validation: ${solutionFiles} and ${inputFiles}`);
            if (!solutionFiles.includes(`${day.toString()}.ts`) || !inputFiles.includes(`${day.toString()}.txt`)) {
                throw new InvalidDayException(dayArg, `Supported values: ${solutionFiles.filter(x => inputFiles.includes(`${x.split('.')[0]}.txt`)).map(x => x.split('.')[0]).join(', ')}.`);
            }
        } else {
            day = undefined;
        }
        return day;
    }

    public getAndValidateArguments(): SupportedArguments {
        const positionalArguments = process.argv.filter(arg => !arg.startsWith('-'));
        const yearArg = positionalArguments[2];
        const year = this.getAndValidateYear(yearArg);
        const dayArg = positionalArguments[3];
        const day = this.getAndValidateDay(dayArg, year);

        const nonPositionalArguments = process.argv.filter(arg => arg.startsWith('-'));
        const useExampleInput = nonPositionalArguments.includes('-e') || nonPositionalArguments.includes('--example');
        const logLevel: LogLevel = this.getMostVerboseLogLevel(nonPositionalArguments);

        return { year, day, useExampleInput, logLevel };
    }
}
