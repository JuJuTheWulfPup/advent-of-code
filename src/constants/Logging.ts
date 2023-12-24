import { LogLevel } from '@nestjs/common';

export const LOG_LEVELS: LogLevel[] = ['fatal', 'error', 'warn', 'log', 'debug', 'verbose']; // array of LogLevels, in order of least logs to most logs
