import { SetMetadata } from '@nestjs/common';

export const IsPublicRequest = () => SetMetadata('isPublicRequest', true);
