---
title: Use Background Tasks for Non-Blocking Operations
impact: MEDIUM
impactDescription: faster response times
tags: server, async, logging, analytics, side-effects
---

## Use Background Tasks for Non-Blocking Operations

Use your runtime's background task mechanism, queue, or fire-and-forget worker to schedule work that should execute after a response is sent. This prevents logging, analytics, and other side effects from blocking the response.

**Incorrect (blocks response):**

```tsx
import { logUserAction } from '@/app/utils';

export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request);

  // Logging blocks the response
  const userAgent = request.headers.get('user-agent') || 'unknown';
  await logUserAction({ userAgent });

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

**Correct (non-blocking):**

```tsx
import { logUserAction } from '@/app/utils';
import { queueBackgroundTask } from '@/app/background';

export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request);

  // Log after response is sent
  queueBackgroundTask(async () => {
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const sessionCookie = request.headers.get('x-session-id') || 'anonymous';

    await logUserAction({ sessionCookie, userAgent });
  });

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

The response is sent immediately while logging happens in the background.

**Common use cases:**

- Analytics tracking
- Audit logging
- Sending notifications
- Cache invalidation
- Cleanup tasks

**Important notes:**

- Prefer durable queues for important side effects
- Make background work idempotent because retries are common
- Avoid reading mutable request state after handing work off
