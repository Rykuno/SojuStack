---
title: Authenticate Server Mutations Like API Routes
impact: CRITICAL
impactDescription: prevents unauthorized access to server mutations
tags: server, authentication, security, authorization, mutations
---

## Authenticate Server Mutations Like API Routes

**Impact: CRITICAL (prevents unauthorized access to server mutations)**

Any server-side mutation endpoint, RPC handler, or server function should be treated like a public API route. Always verify authentication and authorization **inside** the mutation handler. Do not rely solely on middleware, route guards, or client-side checks.

**Incorrect (no authentication check):**

```typescript
export async function deleteUser(userId: string) {
  // Anyone can call this! No auth check
  await db.user.delete({ where: { id: userId } });
  return { success: true };
}
```

**Correct (authentication inside the action):**

```typescript
import { verifySession } from '@/lib/auth';
import { unauthorized } from '@/lib/errors';

export async function deleteUser(userId: string) {
  // Always check auth inside the action
  const session = await verifySession();

  if (!session) {
    throw unauthorized('Must be logged in');
  }

  // Check authorization too
  if (session.user.role !== 'admin' && session.user.id !== userId) {
    throw unauthorized('Cannot delete other users');
  }

  await db.user.delete({ where: { id: userId } });
  return { success: true };
}
```

**With input validation:**

```typescript
import { verifySession } from '@/lib/auth';
import { z } from 'zod';

const updateProfileSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

export async function updateProfile(data: unknown) {
  // Validate input first
  const validated = updateProfileSchema.parse(data);

  // Then authenticate
  const session = await verifySession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  // Then authorize
  if (session.user.id !== validated.userId) {
    throw new Error('Can only update own profile');
  }

  // Finally perform the mutation
  await db.user.update({
    where: { id: validated.userId },
    data: {
      name: validated.name,
      email: validated.email,
    },
  });

  return { success: true };
}
```
