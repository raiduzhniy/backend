import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const configService = app.get(ConfigService);

  // @ts-ignore
  app.setGlobalPrefix(configService.get('API_URL'));

  // @ts-ignore
  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
