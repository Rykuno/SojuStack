---
title: Defer Non-Critical Third-Party Libraries
impact: MEDIUM
impactDescription: loads after hydration
tags: bundle, third-party, analytics, defer
---

## Defer Non-Critical Third-Party Libraries

Analytics, logging, and error tracking don't block user interaction. Load them after hydration.

**Incorrect (blocks initial bundle):**

```tsx
import { Analytics } from '@vercel/analytics/react';

export function App() {
  return (
    <>
      <main>{/* app content */}</main>
      <Analytics />
    </>
  );
}
```

**Correct (loads after hydration):**

```tsx
import { lazy, Suspense, useEffect, useState } from 'react';

const Analytics = lazy(() =>
  import('@vercel/analytics/react').then((m) => ({ default: m.Analytics })),
);

export function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <main>{/* app content */}</main>
      {mounted ? (
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      ) : null}
    </>
  );
}
```
