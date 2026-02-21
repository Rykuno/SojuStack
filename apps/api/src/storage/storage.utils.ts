import type { StorageConfig } from 'src/common/config/storage.config';

type PublicStorageConfig = Pick<StorageConfig, 'url' | 'bucketName'>;

export function toPublicStorageUrl(
  storageConfig: PublicStorageConfig,
  storageKey: string | null | undefined,
) {
  if (!storageKey) {
    return null;
  }

  const storageUrl = storageConfig.url.replace(/\/+$/, '');
  return `${storageUrl}/${storageConfig.bucketName}/${storageKey}`;
}
