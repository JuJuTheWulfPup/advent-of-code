// Vendor
import { Module } from '@nestjs/common';
import { ConsoleLoggerModule } from './services/ConsoleLogger.module';
import { ProgramRunner } from './services/ProgramRunner.service';
import { SolutionRunner } from './services/SolutionRunner.service';

@Module({
    imports: [ConsoleLoggerModule],
    providers: [ProgramRunner, SolutionRunner]
})
export class AppModule {}
