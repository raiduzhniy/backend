import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService: ConfigService = app.get(ConfigService);
  const prefix = configService.get('apiUrl');
  const port = configService.get('port') || 3000;

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix(prefix);

  await app.listen(port);
})();
