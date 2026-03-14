import { Injectable } from '@nestjs/common';
import { Session, User } from 'better-auth/db';

@Injectable()
export class AuthService {
  async afterUserCreated(user: User) {
    console.log('afterUserCreated', user);
  }

  async beforeSessionCreated(session: Session): Promise<Session> {
    return session;
  }
}
