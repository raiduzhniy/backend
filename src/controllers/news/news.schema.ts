import { StorageSchema } from '@shared/abstract-classes';

export class NewsSchema extends StorageSchema {
  title: string;

  html: string;

  createdAt: string;

  editedAt?: string;
}

export interface News extends Omit<NewsSchema, 'storagePath'> {
  imageUrl: string;
}
