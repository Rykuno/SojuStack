import { Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaClient } from 'src/generated/prisma/client';
import { FileNotFoundException } from '../exceptions/storage.exception';

export interface CreateFileMetadataParams {
  name: string;
  mimeType: string;
  sizeBytes: number;
  storageKey?: string; // Optional, will be generated if not provided
}

@Injectable()
export class FileMetadataService {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaClient>
    >,
  ) {}

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
    const storageKey = params.storageKey ?? this.generateStorageKey(params.mimeType);

    return this.txHost.tx.file.create({
      data: {
        name: params.name,
        mimeType: params.mimeType,
        sizeBytes: params.sizeBytes,
        storageKey,
      },
    });
  }

  /**
   * Get file metadata by ID
   */
  async findById(id: string) {
    const file = await this.txHost.tx.file.findUnique({
      where: { id },
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
    return this.txHost.tx.file.findFirst({
      where: { storageKey },
    });
  }

  /**
   * Count references to a storage key
   * Used for reference counting before deleting files
   */
  async countReferencesByStorageKey(storageKey: string): Promise<number> {
    return this.txHost.tx.file.count({
      where: { storageKey },
    });
  }

  /**
   * Delete a file metadata record
   */
  async delete(id: string) {
    return this.txHost.tx.file.delete({
      where: { id },
    });
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

