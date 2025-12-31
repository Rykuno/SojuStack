import { authClient } from '../auth-client'

interface ApiHandler {
  queryKeys: string[]
}

export class AuthApi implements ApiHandler {
  readonly queryKeys = ['auth']

  async getUserQueryOptions() {}
}
