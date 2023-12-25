import { Global, Module } from '@nestjs/common';
import { ConsoleLoggerService } from './ConsoleLogger.service';

@Global()
@Module({
    providers: [ConsoleLoggerService],
    exports: [ConsoleLoggerService]
})
export class ConsoleLoggerModule {}
