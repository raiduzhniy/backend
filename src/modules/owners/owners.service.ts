import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Owner, OwnerSchema } from './owner.schema';
import { OwnerDto } from './owner-dto.class';

@Injectable()
export class OwnersService {
  constructor(@InjectModel(Owner.name) private ownerModel: Model<Owner>) {}

  createOwner(ownerDto: OwnerDto): Promise<Owner> {
    const owner: OwnerSchema = new this.ownerModel(ownerDto);

    return owner.save();
  }

  findOwnerAndDelete(ownerId: string): Promise<Owner> {
    return this.ownerModel.findByIdAndDelete(ownerId);
  }
}
