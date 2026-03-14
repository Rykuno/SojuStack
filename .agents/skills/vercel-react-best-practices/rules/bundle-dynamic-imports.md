---
title: Dynamic Imports for Heavy Components
impact: CRITICAL
impactDescription: directly affects TTI and LCP
tags: bundle, dynamic-import, code-splitting
---

## Dynamic Imports for Heavy Components

Use `import()` and `React.lazy()` to lazy-load large components not needed on initial render.

**Incorrect (Monaco bundles with main chunk ~300KB):**

```tsx
import { MonacoEditor } from './monaco-editor';

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />;
}
```

**Correct (Monaco loads on demand):**

```tsx
import { Suspense, lazy } from 'react';

const MonacoEditor = lazy(() =>
  import('./monaco-editor').then((m) => ({ default: m.MonacoEditor })),
);

function CodePanel({ code }: { code: string }) {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <MonacoEditor value={code} />
    </Suspense>
  );
}
```
