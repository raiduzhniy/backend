import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Owner } from '../owners';
import { Vehicle } from '../vehicles';
import { UserRole } from './users.enum';

export type UserSchema = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    dropDups: true,
    immutable: false,
  })
  login: string;

  @Prop({ type: String, required: true, select: false })
  passwordHash?: string;

  @Prop([{ type: String, required: true }])
  roles: UserRole[];

  @Prop({ type: Number, unique: true, dropDups: true, immutable: false })
  apartmentNumber: number;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }])
  owners: (Owner | string)[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }])
  vehicles: (Vehicle | string)[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
    delete ret.__v;
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
