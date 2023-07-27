import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const setupApplication = (app: INestApplication): INestApplication => {
  const configService: ConfigService = app.get(ConfigService);
  const prefix = configService.get('apiUrl');

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix(prefix);

  return app;
};
