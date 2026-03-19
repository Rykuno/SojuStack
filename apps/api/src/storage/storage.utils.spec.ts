import { describe, expect, it } from 'vite-plus/test';
import {
  getStorageFileExtension,
  normalizeStorageFileName,
  normalizeStorageKey,
} from './storage.utils';

describe('storage-path utils', () => {
  it('normalizes flat storage keys', () => {
    expect(normalizeStorageKey(' my avatar?.png ')).toBe('my-avatar.png');
  });

  it('rejects nested storage keys', () => {
    expect(() => normalizeStorageKey('avatars/user-1.png')).toThrow(
      'Storage keys must be flat. Nested paths are not supported.',
    );
  });

  it('normalizes file names', () => {
    expect(normalizeStorageFileName('my avatar.png')).toBe('my-avatar.png');
  });

  it('rejects empty file names', () => {
    expect(() => normalizeStorageFileName('   ')).toThrow('Storage file name cannot be empty.');
  });

  it('keeps the original file extension when present', () => {
    expect(getStorageFileExtension('Avatar.JPG')).toBe('.jpg');
    expect(getStorageFileExtension(undefined)).toBe('');
  });
});
