import { BadRequestException } from '@nestjs/common';
import { basename, extname, posix } from 'node:path';
import sanitizeFilename from 'sanitize-filename';

// Removes invisible control characters so storage keys stay readable and safe.
function stripControlCharacters(value: string) {
  return Array.from(value)
    .filter((character) => character >= ' ')
    .join('');
}

// Normalizes any incoming storage key into the flat key format used by the app.
export function normalizeStorageKey(key: string) {
  // Trim outer whitespace, normalize slashes, remove control characters, collapse path syntax,
  // and strip any leading slash so the key is always relative to the selected bucket.
  const normalizedKey = posix
    .normalize(stripControlCharacters(key.trim().replace(/\\/g, '/')))
    .replace(/^\/+/, '');

  // Reject empty keys early before any storage call is attempted.
  if (!normalizedKey || normalizedKey === '.') {
    throw new BadRequestException('Storage key cannot be empty.');
  }

  // This storage layer only supports flat keys, so nested paths are not allowed.
  if (normalizedKey === '..' || normalizedKey.includes('/')) {
    throw new BadRequestException('Storage keys must be flat. Nested paths are not supported.');
  }

  // Use a well-known filename sanitizer, then replace whitespace with dashes and
  // collapse repeated dashes to keep the final key predictable.
  const sanitizedKey = sanitizeFilename(normalizedKey).replace(/\s+/g, '-').replace(/-+/g, '-');

  // Sanitization can remove everything, so validate again after cleanup.
  if (!sanitizedKey || sanitizedKey === '.' || sanitizedKey === '..') {
    throw new BadRequestException('Storage key cannot be empty.');
  }

  return sanitizedKey;
}

// Validates a caller-provided file name before running it through the shared key normalizer.
export function normalizeStorageFileName(name: string) {
  // File names get their own early validation so the error message stays specific.
  const trimmedName = stripControlCharacters(name.trim());

  if (!trimmedName || trimmedName === '.' || trimmedName === '..') {
    throw new BadRequestException('Storage file name cannot be empty.');
  }

  // Reuse the same normalization rules as any other storage key.
  const normalizedName = normalizeStorageKey(trimmedName);

  return normalizedName;
}

// Returns a lowercase extension so generated keys keep a stable file suffix.
export function getStorageFileExtension(name: string | undefined) {
  if (!name) {
    return '';
  }

  // Drop any directory portion first, then extract and normalize the extension.
  return extname(basename(name.trim().replace(/\\/g, '/'))).toLowerCase();
}
