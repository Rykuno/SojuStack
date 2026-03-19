import { SetMetadata } from '@nestjs/common';

export const AUTH_TYPE_KEY = 'authType';
export enum AuthType {
  Optional = 'optional',
  Authenticated = 'authenticated',
  Unauthenticated = 'unauthenticated',
}

export const Auth = (authType: AuthType) => SetMetadata(AUTH_TYPE_KEY, authType);
