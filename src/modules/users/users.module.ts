import { Global, Module } from '@nestjs/common';
import { OwnersModule } from '../owners';
import { VehiclesModule } from '../vehicles';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Global()
@Module({
  imports: [OwnersModule, VehiclesModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
