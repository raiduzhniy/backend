import { StorageType } from './firebase-storage.enum';

export interface StorageRefData {
  fileName: string;
  storageType: StorageType;
}

export interface UploadFileInterface extends StorageRefData {
  fileData: Blob | Uint8Array | ArrayBuffer;
}
