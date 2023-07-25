export abstract class SchemaBase {
  id?: string;
}

export abstract class StorageSchema extends SchemaBase {
  storagePath: string;
}
