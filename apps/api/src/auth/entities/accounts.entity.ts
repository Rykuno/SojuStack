import { Entity, PrimaryKey, Property, ManyToOne, t } from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';
import { createId } from '@paralleldrive/cuid2';

@Entity()
export class Account {
  @PrimaryKey({ type: t.text, default: createId() })
  id: string;

  @Property({ type: t.text })
  accountId: string;

  @Property({ type: t.text })
  providerId: string;

  @ManyToOne(() => User, { deleteRule: 'cascade' })
  user: User;

  @Property({ nullable: true, type: t.text })
  accessToken?: string;

  @Property({ nullable: true, type: t.text })
  refreshToken?: string;

  @Property({ nullable: true, type: t.text })
  idToken?: string;

  @Property({ nullable: true, type: t.date })
  accessTokenExpiresAt?: Date;

  @Property({ nullable: true, type: t.date })
  refreshTokenExpiresAt?: Date;

  @Property({ nullable: true, type: t.text })
  scope?: string;

  @Property({ nullable: true, type: t.text })
  password?: string;

  @Property({ type: t.date })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
