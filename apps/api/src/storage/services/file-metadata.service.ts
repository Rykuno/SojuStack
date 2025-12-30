import { Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { FileNotFoundException } from '../exceptions/storage.exception';
import { DatabaseTransactionHost } from 'src/databases/database.provider';
import { files } from 'src/databases/database.schema';
import { eq } from 'drizzle-orm';
import { takeFirstOrThrow } from 'src/databases/database.utils';

export interface CreateFileMetadataParams {
  name: string;
  mimeType: string;
  sizeBytes: number;
  storageKey?: string; // Optional, will be generated if not provided
}

@Injectable()
export class FileMetadataService {
  constructor(private readonly txHost: DatabaseTransactionHost) {}

  /**
   * Generate a storage key from file metadata
   */
  generateStorageKey(mimeType: string): string {
    const extension = mimeType.split('/')[1] ?? 'bin';
    return `${createId()}.${extension}`;
  }

  /**
   * Create a file metadata record
   */
  async create(params: CreateFileMetadataParams) {
    const storageKey =
      params.storageKey ?? this.generateStorageKey(params.mimeType);

    return this.txHost.tx
      .insert(files)
      .values({
        name: params.name,
        mimeType: params.mimeType,
        sizeBytes: params.sizeBytes,
        storageKey,
      })
      .returning()
      .then(takeFirstOrThrow);
  }

  /**
   * Get file metadata by ID
   */
  async findById(id: string) {
    const file = await this.txHost.tx.query.files.findFirst({
      where: {
        id,
      },
    });

    if (!file) {
      throw new FileNotFoundException(id);
    }

    return file;
  }

  /**
   * Get file metadata by storage key
   */
  async findByStorageKey(storageKey: string) {
    return this.txHost.tx.query.files.findFirst({
      where: {
        storageKey,
      },
    });
  }

  /**
   * Count references to a storage key
   * Used for reference counting before deleting files
   */
  async countReferencesByStorageKey(storageKey: string): Promise<number> {
    return this.txHost.tx.query.files
      .findMany({
        where: {
          storageKey,
        },
      })
      .then((files) => files.length);
  }

  /**
   * Delete a file metadata record
   */
  async delete(id: string) {
    return this.txHost.tx.delete(files).where(eq(files.id, id));
  }

  /**
   * Check if a file should be deleted from storage
   * Returns true if the file has no other references
   */
  async shouldDeleteFromStorage(storageKey: string): Promise<boolean> {
    const count = await this.countReferencesByStorageKey(storageKey);
    return count <= 1;
  }
}
