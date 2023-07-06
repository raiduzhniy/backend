import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OwnerSchema = HydratedDocument<Owner>;

@Schema()
export class Owner {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, default: '' })
  surname?: string;

  @Prop([{ type: String }])
  phoneNumbers?: string[];
}

export const OwnerSchema = SchemaFactory.createForClass(Owner);

OwnerSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
    delete ret.__v;
    delete ret._id;
  },
});
