import { Catch, ExceptionFilter, Injectable } from '@nestjs/common';
import { ConsoleLoggerService } from './ConsoleLogger.service';

// todo: figure this out
@Catch()
@Injectable()
export class ErrorFilter implements ExceptionFilter {
    constructor(private readonly consoleLoggerService: ConsoleLoggerService) {}

    catch(exception: Error): void {
        const stackTrace = exception.stack ? `\n${exception.stack}` : '';
        console.log(`${exception.message}${stackTrace}`);
        throw exception;
    }
}
