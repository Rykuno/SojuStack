import { Injectable } from '@nestjs/common';
import { Session, User } from 'better-auth/db';

@Injectable()
export class AuthService {
  afterUserCreated(user: User) {
    console.log('afterUserCreated', user);
  }

  beforeSessionCreated(session: Session): Session {
    return session;
  }
}
