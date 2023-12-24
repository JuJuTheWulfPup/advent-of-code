import { Injectable, LogLevel, LoggerService } from '@nestjs/common';

export type LogContent = string | { header: string; content: string | boolean | number };

@Injectable()
export class ConsoleLoggerService implements LoggerService {
    private enabledLogLevels: LogLevel[] = ['log', 'debug', 'error', 'warn'];

    /**
     * Set the log levels you want reported
     * @default ['error', 'warn']
     * @param levels
     * @returns {LogReporterService}
     */
    setLogLevels(levels: LogLevel[]): ConsoleLoggerService {
        this.enabledLogLevels = levels;
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
        if (logLevel === 'verbose' || this.enabledLogLevels.includes(logLevel)) {
            let fullMessage = message;
            if (optional) {
                fullMessage += ` (${optional.map(x => (typeof x === 'string' ? x : JSON.stringify(x))).join(', ')})\x1b[0m`;
            }
            console.log(fullMessage);
        }
    }
}
