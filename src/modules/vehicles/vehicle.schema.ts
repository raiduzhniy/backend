import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { VehicleType } from './vehicles.enum';

export type VehicleSchema = HydratedDocument<Vehicle>;

@Schema()
export class Vehicle {
  @Prop({ type: String, required: true })
  type: VehicleType;

  @Prop({ type: String, required: true })
  brand: string;

  @Prop({ type: String, required: true })
  plateNumber: string;

  @Prop({ type: String })
  model?: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

VehicleSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
    delete ret.__v;
    delete ret._id;
  },
});
