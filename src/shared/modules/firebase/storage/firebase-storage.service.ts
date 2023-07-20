import {
  FirebaseStorage,
  StorageReference,
  UploadMetadata,
  UploadResult,
} from '@firebase/storage';
import { Injectable } from '@nestjs/common';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { StorageType } from './firebase-storage.enum';
import {
  StorageRefData,
  UploadFileInterface,
} from './firebase-storage.interface';

@Injectable()
export class FirebaseStorageService {
  uploadFile(
    { storageType, fileName, fileData }: UploadFileInterface,
    metadata?: UploadMetadata,
  ): Promise<UploadResult> {
    return uploadBytes(
      this.getStorageRef(fileName, storageType),
      fileData,
      metadata,
    );
  }

  getStorageRef(path: string, storageType: StorageType): StorageReference {
    return ref(this.storage, `${storageType}/${path}`);
  }

  getDownloadLink(data: StorageRefData | StorageReference): Promise<string> {
    return getDownloadURL(this.createStorageRef(data));
  }

  deleteFile(data: StorageRefData | StorageReference): Promise<void> {
    return deleteObject(this.createStorageRef(data));
  }

  private get storage(): FirebaseStorage {
    return getStorage();
  }

  private createStorageRef(
    data: StorageRefData | StorageReference,
  ): StorageReference {
    return 'storageType' in data
      ? this.getStorageRef(data.fileName, data.storageType)
      : data;
  }
}
