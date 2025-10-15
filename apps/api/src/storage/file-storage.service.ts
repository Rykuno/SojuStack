import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.service';

@Injectable()
export class FileStorageService {
  constructor(private readonly storageService: StorageService) {}

  async create(file: Express.Multer.File) {
    return this.storageService.create(file);
  }

  async delete(id: string) {
    return this.storageService.delete(id, { forceDelete: true });
  }
}
