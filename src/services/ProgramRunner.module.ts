import { Global, Module } from '@nestjs/common';
import { ProgramRunnerService } from './ProgramRunner.service';
import { ConsoleLoggerService } from './logger/ConsoleLogger.service';
import { ConsoleLoggerModule } from './logger/ConsoleLogger.module';
import { ArgumentParserService } from './ArgumentParser.service';
import { SolutionRunnerService } from './SolutionRunner.service';

@Global()
@Module({
    imports: [ConsoleLoggerModule],
    providers: [
        ArgumentParserService,
        ConsoleLoggerService,
        ProgramRunnerService,
        SolutionRunnerService
    ],
    exports: [ProgramRunnerService]
})
export class ProgramRunnerServiceModule {}
