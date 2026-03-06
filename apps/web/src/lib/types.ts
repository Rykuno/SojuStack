import { components } from 'api/generated/openapi';

export abstract class ApiHandler {
  abstract queryKeys: string[];
}

type Schema = components['schemas'];

export type User = Schema['UserDto'];
