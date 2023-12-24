import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProgramRunner } from './services/ProgramRunner.service';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.createApplicationContext(AppModule);
    const programRunner = app.get(ProgramRunner);
    programRunner.run();
}
bootstrap();
