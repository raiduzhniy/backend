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
import { UploadFileInterface } from './firebase-storage.interface';

@Injectable()
export class FirebaseStorageService {
  uploadFile(
    { storageType, fileName, fileData }: UploadFileInterface,
    metadata?: UploadMetadata,
  ): Promise<UploadResult> {
    return uploadBytes(
      this.getStorageRef(`${storageType}/${fileName}`),
      fileData,
      metadata,
    );
  }

  getStorageRef(storagePath: string): StorageReference {
    return ref(this.storage, storagePath);
  }

  getDownloadLink(storagePath: string): Promise<string> {
    return getDownloadURL(this.getStorageRef(storagePath));
  }

  deleteFile(storagePath: string): Promise<void> {
    return deleteObject(this.getStorageRef(storagePath));
  }

  private get storage(): FirebaseStorage {
    return getStorage();
  }
}
