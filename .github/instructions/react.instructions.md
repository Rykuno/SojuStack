---
applyTo: '**/*.ts,**/*.tsx,**/*.js,**/*.jsx'
---

# React Development Standards

## Important for AI Assistants

**BEFORE writing any React code:**

1. Check the relevant package.json to see what libraries are available
2. Use existing components from the codebase - don't reinvent the wheel
3. Follow the patterns already established in the codebase
4. Never suggest adding new dependencies without checking if functionality already exists

## Component Structure

- Use functional components exclusively (Error Boundaries are the only exception)
- Keep components small and focused on a single responsibility
- Extract reusable logic into custom hooks
- Use composition over inheritance
- Implement proper types with TypeScript
- Build complex UIs from simple, reusable components
- Note: Code organization and sorting are handled automatically by tooling

## Hooks

- Follow the Rules of Hooks (only call at top level, only call from React functions)
- Use custom hooks for reusable logic (prefix with `use`, e.g., `useUserData`)
- Keep hooks focused and simple - one hook, one purpose
- Use appropriate dependency arrays in `useEffect` - include all dependencies
- Implement cleanup in `useEffect` when needed (timers, subscriptions, etc.)

## State Management

- Use `useState` for local component state
- Implement `useReducer` for complex state logic
- Keep state as close to where it's used as possible
- **ALWAYS handle all states**: loading, error, empty, and success states for data fetching
- Return early for each state (error → loading → empty → success)
- Avoid prop drilling - lift state up or use composition instead
- Prefer custom hooks for shared logic (better SSR compatibility than Context)
- Don't add state libraries (Zustand, MobX, etc.) - hooks and router state are sufficient
- Use the router to drive application state when possible

## Performance

- Only use memoization (`useMemo`, `useCallback`, `memo`) when performance issues are measured
- Use stable, unique values for `key` props in lists (never use array index for dynamic lists)
- Implement code splitting with `React.lazy()` for large components
- Debounce expensive operations in event handlers

## Error Handling

- Implement Error Boundaries for catching component errors
- Handle `async` errors properly
- Show user-friendly error messages
- Implement proper fallback UI
- Log errors appropriately
- Handle edge cases gracefully

## Valid HTML Structure

**CRITICAL: Always write valid HTML. Invalid nesting breaks accessibility, SEO, and can cause unpredictable behavior.**

### Never Nest Interactive Elements

- **NEVER** put a `<button>` inside an `<a>` tag
- **NEVER** put an `<a>` inside a `<button>` tag
- **NEVER** put a `<button>` inside another `<button>`
- **NEVER** put interactive elements (button, a, input, select, textarea) inside each other

### Common Invalid Patterns to Avoid

```tsx
// ❌ INVALID - button inside link
<Link to="/page">
  <button>Click me</button>
</Link>

// ❌ INVALID - link inside button
<button>
  <a href="/page">Click me</a>
</button>

// ❌ INVALID - button inside button
<button>
  Parent <button>Child</button>
</button>

// ✅ VALID - use onClick handler instead
<button onClick={() => navigate('/page')}>
  Click me
</button>

// ✅ VALID - style link as button
<Link to="/page" className="button-styles">
  Click me
</Link>
```

### Other HTML Nesting Rules

- **Block elements** (div, p, h1-h6) cannot be inside inline elements (span, a, em)
- **Paragraphs** (`<p>`) cannot contain block-level elements (div, h1-h6, p, ul, etc.)
- **Lists** (ul, ol) can only contain `<li>` as direct children
- **Tables** must follow proper structure: table > thead/tbody/tfoot > tr > td/th

### Using `asChild` Pattern Correctly

When using libraries like Radix UI that support `asChild`:

```tsx
// ✅ VALID - proper composition
<TooltipTrigger asChild>
  <button>Hover me</button>
</TooltipTrigger>

// ❌ INVALID - would create nested buttons
<PopoverTrigger asChild>
  <button>
    <button>Nested button</button>
  </button>
</PopoverTrigger>
```

## Accessibility

- Use semantic HTML elements (button, nav, main, etc.)
- Add ARIA labels to interactive elements
- Ensure keyboard navigation works
- Manage focus for modals and dynamic content
- **Validate HTML structure** - invalid nesting breaks screen readers

## Code Organization

- Group related components in the same directory
- Use kebabCase for component files (e.g., `user-profile.tsx`)
- Keep styles, types, and tests close to components
- Use named exports for components and utilities
- Exception: Use default exports for route/page components in file-based routing

## Examples

### Complete Component Pattern

```tsx
type UserListProps = {
  readonly teamId: string;
};

export const UserList = ({ teamId }: UserListProps) => {
  // Custom data-fetching hook (e.g., TanStack Query)
  const { data, error, isLoading } = useTeamUsers(teamId);

  // Handle all states: loading, error, empty, success
  if (error) throw error;
  if (isLoading) return <Loading />;
  if (!data?.length) return <ZeroState message='No team members' />;

  return (
    <ul className='space-y-2'>
      {data.map((user) => (
        <UserListItem key={user.id} user={user} />
      ))}
    </ul>
  );
};
```

### Custom Hook Example

```tsx
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

### Performance & Memoization

```tsx
// Only memoize when necessary (expensive computations or stable references)
export const UserList = memo(function UserList({ users, onSelect }: Props) {
  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => a.name.localeCompare(b.name)),
    [users],
  );

  const handleSelect = useCallback(
    (id: string) => {
      onSelect(id);
    },
    [onSelect],
  );

  return <>{/* render sorted users */}</>;
});
```
