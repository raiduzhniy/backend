import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseStorageService, StorageType } from '../firebase-storage';

@Injectable()
export class ImagesService {
  constructor(private firebaseStorageService: FirebaseStorageService) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname.replace(' ', '_')}`;

    const uploaded = await this.firebaseStorageService.uploadFile(
      {
        storageType: StorageType.Images,
        fileName,
        fileData: file.buffer,
      },
      {
        contentType: file.mimetype,
      },
    );

    return this.firebaseStorageService.getDownloadLink(uploaded.ref);
  }

  async deleteImage(fileName: string): Promise<void> {
    try {
      await this.firebaseStorageService.deleteFile({
        storageType: StorageType.Images,
        fileName,
      });

      return;
    } catch (error) {
      throw new InternalServerErrorException('Can not delete the file');
    }
  }
}
