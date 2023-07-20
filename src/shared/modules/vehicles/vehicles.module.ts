import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';

@Module({
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
