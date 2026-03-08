import { Injectable } from '@nestjs/common';
import { Session } from 'better-auth/db';
import { User } from 'better-auth/types';

@Injectable()
export class BetterAuthHooksService {
  async afterUserCreated(user: User): Promise<void> {}

  async beforeSessionCreated(session: Session): Promise<Session> {
    return session;
  }
}
