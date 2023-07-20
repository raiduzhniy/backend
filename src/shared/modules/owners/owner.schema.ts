import { SchemaBase } from '../../abstract-classes';

export class Owner extends SchemaBase {
  name: string;
  surname?: string;
  phoneNumbers?: string[];
}
