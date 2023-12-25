import { Catch, ExceptionFilter, Injectable } from '@nestjs/common';
import { ConsoleLoggerService } from '../logger/ConsoleLogger.service';

// todo: figure this out
@Catch()
@Injectable()
export class ErrorFilter implements ExceptionFilter {
    constructor(private readonly consoleLoggerService: ConsoleLoggerService) {}

    catch(exception: Error): void {
        const stackTrace = exception.stack ? `\n${exception.stack}` : '';
        this.consoleLoggerService.debug(`MY ERROR LOGGER ${exception.message}${stackTrace}`);
        throw exception;
    }
}
