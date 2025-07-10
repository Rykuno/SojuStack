import { SetMetadata } from '@nestjs/common';

export const AUTH_TYPE_KEY = 'authType';
export enum AuthType {
  Required = 'required',
  Public = 'public',
}

export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
