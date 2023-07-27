import { IFile } from '@shared/interfaces';
import { ValidateBy, ValidationArguments } from 'class-validator';

export const IsFile = (): PropertyDecorator => {
  return ValidateBy({
    name: 'isFile',
    validator: {
      validate(value: IFile): boolean {
        return !!value?.buffer;
      },
      defaultMessage(validationArguments?: ValidationArguments): string {
        return `Field '${validationArguments.property}' is not a file`;
      },
    },
  });
};

export const IsSupportedMimeTypes = (types: string[]): PropertyDecorator => {
  return ValidateBy({
    name: 'isFile',
    validator: {
      validate(value: IFile): boolean {
        return types.includes(value.mimetype);
      },
      defaultMessage(): string {
        return `Incorrect file type`;
      },
    },
  });
};
