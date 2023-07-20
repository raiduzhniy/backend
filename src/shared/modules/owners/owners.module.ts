import { Global, Module } from '@nestjs/common';
import { OwnersService } from './owners.service';

@Global()
@Module({
  providers: [OwnersService],
  exports: [OwnersService],
})
export class OwnersModule {}
