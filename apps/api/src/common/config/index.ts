export { default as AppConfig } from './app.config';
export { default as AuthConfig } from './auth.config';
export { default as CacheConfig } from './cache.config';
export { default as DatabaseConfig } from './database.config';
export { default as MailConfig } from './mail.config';
export { default as StorageConfig } from './storage.config';

import AppConfig from './app.config';
import AuthConfig from './auth.config';
import CacheConfig from './cache.config';
import DatabaseConfig from './database.config';
import MailConfig from './mail.config';
import StorageConfig from './storage.config';

export const configs = [
  AppConfig,
  AuthConfig,
  CacheConfig,
  DatabaseConfig,
  MailConfig,
  StorageConfig,
];
