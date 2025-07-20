import { Entity, PrimaryKey, Property, Index, t } from '@mikro-orm/core';
import { createId } from '@paralleldrive/cuid2';

@Entity()
@Index({ properties: ['identifier'] })
export class Verification {
  @PrimaryKey({ type: t.text, default: createId() })
  id: string;

  @Property({ type: t.text })
  identifier: string;

  @Property({ type: t.text })
  value: string;

  @Property({ type: t.date })
  expiresAt: Date;

  @Property({ type: t.date })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), type: t.date })
  updatedAt: Date = new Date();
}
