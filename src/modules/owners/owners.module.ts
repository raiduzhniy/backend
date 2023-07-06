import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Owner, OwnerSchema } from './owner.schema';
import { OwnersService } from './owners.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Owner.name, schema: OwnerSchema }]),
  ],
  providers: [OwnersService],
  exports: [OwnersService],
})
export class OwnersModule {}
