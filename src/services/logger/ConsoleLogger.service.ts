/* eslint-disable no-console */
import { Injectable, LogLevel, LoggerService } from '@nestjs/common';
import { getLogLevels } from '../../constants/Logging';

export type LogContent = string | { header: string; content: string | boolean | number };

@Injectable()
export class ConsoleLoggerService implements LoggerService {
    private enabledLogLevels: LogLevel[] = getLogLevels('error');

    setMostVerboseLogLevel(logLevel: LogLevel): ConsoleLoggerService {
        this.setLogLevels(getLogLevels(logLevel));
        return this;
    }

    /**
     * Set the log levels you want reported
     * @default ['log', 'fatal', 'error']
     * @param levels
     * @returns {LogReporterService}
     */
    setLogLevels(levels: LogLevel[]): ConsoleLoggerService {
        this.enabledLogLevels = levels;
        this.verbose(`Log Levels set to [${levels}].`);
        return this;
    }

    /**
     * Report information that might be useful
     * @param message
     * @param rest
     */
    log(message: string, ...rest: LogContent[]): void {
        return this.send('log', message, ...rest);
    }

    /**
     * Report an error that was not handled / not thought of
     * @param message
     * @param rest
     */
    error(message: string, ...rest: LogContent[]): void {
        return this.send('error', message, ...rest);
    }

    /**
     * Report a warning, that is not harmful
     * @param message
     * @param rest
     */
    warn(message: string, ...rest: LogContent[]): void {
        return this.send('warn', message, ...rest);
    }

    /**
     * Use this when debugging code. Debug logs will show up locally and on testing.
     * Meaning, these will not be visible on production.
     * @param message
     * @param rest
     */
    debug(message: string, ...rest: LogContent[]): void {
        return this.send('debug', message, ...rest);
    }

    /**
     * Log something verbose, this is by default disabled.
     * @param message
     * @param rest
     */
    verbose(message: string, ...rest: LogContent[]): void {
        return this.send('verbose', message, ...rest);
    }

    send(logLevel: LogLevel, message: string, ...optional): void {
        if (this.enabledLogLevels.includes(logLevel)) {
            let fullMessage = message;
            if (this.enabledLogLevels.includes('verbose')) {
                const prefixLength = Math.max(...this.enabledLogLevels.map(name => name.length));
                const spaces = ' '.repeat(prefixLength - logLevel.length);
                fullMessage = `${logLevel.toUpperCase()} ${spaces}| ${fullMessage}`;
            }
            if (optional && optional.length > 0) {
                fullMessage += `(${optional.map(x => (typeof x === 'string' ? x : JSON.stringify(x))).join(', ')})\x1b[0m`;
            }
            console.log(fullMessage);
        }
    }
}
