import { Injectable } from '@nestjs/common';
import { IFile } from '../../interfaces';
import { FirebaseStorageService, StorageType } from '../firebase/storage';

@Injectable()
export class ImagesService {
  constructor(private firebaseStorageService: FirebaseStorageService) {}

  async uploadImage(file: IFile): Promise<string> {
    const fileName = `${Date.now()}_${file.originalname.replace(' ', '_')}`;

    return await this.firebaseStorageService
      .uploadFile(
        {
          storageType: StorageType.Images,
          fileName,
          fileData: file.buffer,
        },
        {
          contentType: file.mimetype,
        },
      )
      .then(async (uploadRes) => {
        return uploadRes.ref.fullPath;
      });
  }

  async deleteImage(storagePath: string): Promise<void> {
    return this.firebaseStorageService.deleteFile(storagePath);
  }

  async getDownloadLink(storagePath: string): Promise<string> {
    return this.firebaseStorageService.getDownloadLink(storagePath);
  }
}
