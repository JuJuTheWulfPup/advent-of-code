// Vendor
import { Module } from '@nestjs/common';
import { ConsoleLoggerModule } from './services/logger/ConsoleLogger.module';
import { SolutionRunnerService } from './services/SolutionRunner.service';
import { ArgumentParserService } from './services/ArgumentParser.service';
import { ProgramRunnerServiceModule } from './services/ProgramRunner.module';
import { ConsoleLoggerService } from './services/logger/ConsoleLogger.service';

@Module({
    imports: [
        ConsoleLoggerModule,
        ProgramRunnerServiceModule
    ],
    providers: [
        ArgumentParserService,
        ConsoleLoggerService,
        SolutionRunnerService
    ]
})
export class GlobalAppModule {}
