import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehicleDto } from './vehicles.dto';
import { Vehicle, VehicleSchema } from './vehicle.schema';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
  ) {}
  createVehicle(vehicleDto: VehicleDto): Promise<Vehicle> {
    const vehicle: VehicleSchema = new this.vehicleModel(vehicleDto);

    return vehicle.save();
  }

  findVehicleAndDelete(vehicleId: string): Promise<Vehicle> {
    return this.vehicleModel.findByIdAndDelete(vehicleId);
  }
}
