import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggingService } from './Logger/logging.service';

const logger = new LoggingService(new ConfigService());

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(logger);
  const config = await app.get(ConfigService);
  const PORT = config.get('PORT') || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
  });
}
bootstrap();

process.on('unhandledRejection', (reason, p) => {
  logger.writeError(`Unhandled Rejection at: Promise ${p}, reason: ${reason}`);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.writeError(`Uncaught Exception thrown: ${err}`);
  process.exit(1);
});
