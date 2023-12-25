import { NestFactory } from '@nestjs/core';
import { GlobalAppModule } from './app.module';
import { ProgramRunnerService } from './services/ProgramRunner.service';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.createApplicationContext(GlobalAppModule);
    const programRunner = app.get(ProgramRunnerService);
    programRunner.run();
}
bootstrap();
