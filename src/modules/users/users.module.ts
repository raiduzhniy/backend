import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OwnersModule } from '../owners';
import { VehiclesModule } from '../vehicles';
import { UsersController } from './users.controller';
import { User, UserSchema } from './user.schema';
import { UsersService } from './users.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    OwnersModule,
    VehiclesModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
