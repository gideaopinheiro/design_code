import { instrumentTelemetry } from './telemetry/open-telemetry';
instrumentTelemetry();

import Bugsnag from '@bugsnag/js';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  Bugsnag.start({
    apiKey: process.env.BUGSNAG_API_KEY,
    // plugins: [BugsnagPluginExpress],
    // otherOptions: value,
  });
  await app.listen(3000);
  console.log('Listening at localhost:3000');
}
bootstrap();
