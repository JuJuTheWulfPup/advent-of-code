import { LogLevel } from '@nestjs/common';

export type SupportedArguments = { year: number; day?: number; useExampleInput?: boolean; logLevel: LogLevel };
