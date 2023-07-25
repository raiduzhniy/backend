import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { ContactsModule } from './controllers/contacts';
import { NewsModule } from './controllers/news';
import configuration from './environments/configuration.environment';
import { AboutUsModule } from './controllers/about-us';
import { AuthModule } from './controllers/auth';
import { FirebaseModule } from '@shared/modules/firebase';
import { UsersModule } from './controllers/users';
import { AuthGuard } from '@shared/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
        },
        level: 'debug',
        serializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
          }),
        },
      },
    }),
    UsersModule,
    AuthModule,
    FirebaseModule,
    AboutUsModule,
    ContactsModule,
    NewsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
