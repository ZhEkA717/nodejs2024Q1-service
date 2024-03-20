import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = await app.get(ConfigService);
  const PORT = config.get("PORT") || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
  })
}
bootstrap();
