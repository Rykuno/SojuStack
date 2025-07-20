import {
  Entity,
  PrimaryKey,
  Property,
  Index,
  ManyToOne,
  t,
} from '@mikro-orm/core';
import { createId } from '@paralleldrive/cuid2';
import { User } from '../../users/entities/user.entity';

// remove custom names for now

@Entity()
@Index({ properties: ['token'] })
export class Session {
  @PrimaryKey({ type: t.text, default: createId() })
  id: string;

  @Property({ type: t.date })
  expiresAt: Date;

  @Property({ unique: true, type: t.text })
  token: string;

  @Property({ nullable: true, type: t.text })
  ipAddress?: string;

  @Property({ nullable: true, type: t.text })
  userAgent?: string;

  @ManyToOne(() => User, { deleteRule: 'cascade' })
  user: User;

  @Property({ type: t.date })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), type: t.date })
  updatedAt: Date = new Date();
}
