import { Injectable } from '@nestjs/common';
import { User, Session } from 'better-auth/types';

@Injectable()
export class AuthHooksService {
  async afterUserCreated(_user: User): Promise<void> {}

  async beforeSessionCreated(session: Session): Promise<Session> {
    return session;
  }
}
