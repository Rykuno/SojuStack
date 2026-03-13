function getRequiredStorageUrl() {
  const storageUrl = String(import.meta.env.VITE_STORAGE_URL ?? '');

  if (!storageUrl) {
    throw new Error('VITE_STORAGE_URL is required');
  }

  return storageUrl.replace(/\/+$/, '');
}

export function getPublicStorageUrl(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  return `${getRequiredStorageUrl()}/public/${path.replace(/^\/+/, '')}`;
}
