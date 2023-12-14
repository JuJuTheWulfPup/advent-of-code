import { Module } from '@nestjs/common';
import { ConsoleLoggerService } from './ConsoleLogger.service';

@Module({
    providers: [ConsoleLoggerService]
})
export class ConsoleLoggerModule {}
