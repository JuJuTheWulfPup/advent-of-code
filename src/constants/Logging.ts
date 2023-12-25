import { LogLevel } from '@nestjs/common';

// array of LogLevels, in order of most logs to least logs
export const LOG_LEVELS: LogLevel[] = ['verbose', 'debug', 'warn', 'error', 'fatal', 'log'];

export const getLogLevels = (mostVerboseLogLevel: LogLevel): LogLevel[] => LOG_LEVELS.slice(LOG_LEVELS.indexOf(mostVerboseLogLevel));
