import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  t,
} from '@mikro-orm/core';
import { createId } from '@paralleldrive/cuid2';
import { Account } from '../../auth/entities/accounts.entity';
import { Session } from '../../auth/entities/session.entity';

@Entity()
export class User {
  @PrimaryKey({ type: t.text, default: createId() })
  id: string;

  @Property({ type: t.text })
  name: string;

  @Property({ unique: true, type: t.text })
  email: string;

  @Property({ type: t.boolean })
  emailVerified: boolean = false;

  @Property({ nullable: true, type: t.text })
  image?: string;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Collection<Account[]>;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Collection<Session[]>;

  @Property({ type: t.date })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), type: t.date })
  updatedAt: Date = new Date();
}
