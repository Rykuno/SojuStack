import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Session } from 'better-auth/db';
import { User } from 'better-auth/types';
import { AuthTopics } from 'src/common/events/topics';

@Injectable()
export class AuthService {
  constructor() {}

  @OnEvent(AuthTopics.AFTER_USER_CREATED)
  async afterUserCreated(user: User): Promise<User> {
    return user;
  }

  @OnEvent(AuthTopics.BEFORE_SESSION_CREATED)
  async beforeSessionCreated(session: Session): Promise<Session> {
    return session;
  }
}
