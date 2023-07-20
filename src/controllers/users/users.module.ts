import { Global, Module } from '@nestjs/common';
import { OwnersModule } from '../../shared/modules/owners';
import { VehiclesModule } from '../../shared/modules/vehicles';
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
