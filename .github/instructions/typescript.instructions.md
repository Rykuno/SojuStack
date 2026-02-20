---
applyTo: '**/*.ts,**/*.tsx,**/*.d.ts'
---

# TypeScript Best Practices

## Important for AI Assistants

Check tsconfig.json for path aliases and use existing types. This project uses strict TypeScript - no implicit `any`.

## TypeScript Configuration

Check the relevant tsconfig.json for each package - they define path aliases like `@/` and compiler options.

## Framework Context

These guidelines represent best practices for general TypeScript code. When working with OOP frameworks (like NestJS), defer to framework-specific conventions:

- **NestJS/Backend**: May use `interface` for DTOs/contracts, `class` for services/entities, decorators, and dependency injection
- **React/Frontend**: Continue using functional patterns, `type` definitions, and composition
- **Shared utilities**: Choose patterns based on primary consumers

Framework-specific instructions will override these guidelines where appropriate.

## Type System

- Use `type` not `interface` for object types
- Prefer schema inference over manual types: use `z.infer<typeof schema>` for Zod schemas
- Make all properties `readonly` by default (when not using schema inference)
- Never use `any` - use `unknown` for truly unknown types
- Use `const` assertions for literal types: `as const`
- Prefer union types over enums
- Use discriminated unions for state machines
- Leverage utility types: `Pick`, `Omit`, `Partial`, `Required`, `NoInfer`
- Use generics for reusable type patterns
- Use `satisfies` for better type checking while preserving literal types
- Use template literal types for string pattern matching
- Use `const` type parameters: `function fn<const T>(param: T)`

## Naming Conventions

- Types: PascalCase (`UserData`, `ApiResponse`)
- Variables/Functions: camelCase (`getUserData`, `isLoading`)
- Constants: UPPER_SNAKE_CASE (`API_ENDPOINT`, `MAX_RETRIES`)
- Boolean variables: prefix with `is/has/should` (`isActive`, `hasError`)
- React component props: suffix with `Props` (`ButtonProps`)
- Event handlers: prefix with `on` (`onClick`, `onSubmit`)

## Code Organization

- Define types right above their usage (not in separate files unless shared)
- Export shared types from `types/` directories or `types.ts` files
- Use direct imports: `import { Button } from './Button'` not `from './components'` (better tree shaking)
- Sort all object properties alphabetically (including Zod schemas)
- Note: Import organization is handled automatically by tooling

## Module Exports

- Use named exports for components and utilities: `export const Button`
- Exception: Use default exports for file-based routing systems
  - Files in `routes/`, `pages/`, `app/` directories often require default exports
  - These enable automatic route generation and code splitting
  - Examples: Next.js pages, TanStack Router routes, Remix routes
- Never mix default and named exports in the same file (except when framework requires it)

## Functions

- Specify return types for public/exported APIs (let TypeScript infer for internal functions)
- Use function declarations for top-level functions (hoisting)
- Use arrow functions for callbacks, inline functions
- Always use async/await instead of `.then()` chains
- Destructure parameters inside the function body for clarity
- Sort destructured const's alphabetically

## Best Practices

- Prefer schema inference (Zod, Yup, etc.) over manual type definitions
- Extract inline types when used multiple times for better reusability
- Avoid type assertions (`as Type`) - let TypeScript infer
- Avoid non-null assertions (`!`) - provide safe fallbacks instead
- Use type guards for runtime checks: `if (typeof x === 'string')`
- Handle null/undefined explicitly with optional chaining (`?.`)
- Use nullish coalescing (`??`) instead of `||` for defaults
- Use template literals for string interpolation instead of concatenation
- Use const assertions on arrays and objects: `[1, 2, 3] as const`
- Add exhaustive checks in switch statements with `never` type
- Create type predicate functions: `(value: unknown): value is User`

## Error Handling

- Type your errors: `catch (error: unknown)`
- Use type guards to check error types in catch blocks
- Create custom error classes with proper typing

## Examples

### Type Definitions

```typescript
// Best: Use schema inference when available (properties alphabetically sorted)
const userSchema = z.object({
  age: z.number(),
  id: z.string(),
  name: z.string(),
});
type UserData = z.infer<typeof userSchema>;

// Good: readonly, alphabetical when manual types needed
type UserProfileProps = {
  readonly age: number;
  readonly id: string;
  readonly name: string;
};

// Bad: mutable, unordered, generic name
interface Props {
  name: string;
  age: number;
  id: string;
}
```

### Function Patterns

```typescript
// Good: Clean signature, destructure in body
type UserData = {
  readonly age: number;
  readonly name: string;
};

export function formatUserInfo(user: UserData): string {
  // Good: Destructure inside the function body + sorted alphabetically
  const { age, name } = user;
  return `${name} is ${age} years old`;
}

// Bad: Inline destructuring makes signature harder to read
export function formatUserInfo({ name, age }: UserData) {
  return `${name} is ${age} years old`;
}
```

### Union Types and Type Guards

```typescript
// Good: Discriminated union with type guards
type ApiResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' };

function handleResponse<T>(response: ApiResponse<T>): string {
  if (response.status === 'loading') {
    return 'Loading...';
  }
  if (response.status === 'error') {
    return `Error: ${response.error}`;
  }
  return `Success: ${JSON.stringify(response.data)}`;
}

// Bad: Using any or loose typing
function handleResponse(response: any) {
  if (response.loading) return 'Loading...';
  if (response.error) return response.error;
  return response.data;
}
```

### Const Assertions

```typescript
// Good: const assertion for literal types
const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS]; // 'active' | 'inactive' | 'pending'

// Bad: Using enum
enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}
```

### Handling Nullable Types

```typescript
// Good: Safe navigation and defaults
const userName = user?.profile?.name;
const displayName = userName ?? 'Anonymous'; // Only replaces null/undefined
const result = api.query(workspaceId ?? '');

// Bad: Unsafe access and wrong defaults
const userName = user.profile.name; // Crashes if null
const displayName = userName || 'Anonymous'; // Replaces empty string
const result = api.query(workspaceId!); // Runtime crash if null

// Type guards for null checking
function processUser(user: User | null): string {
  if (user == null) return 'No user available';
  return user.name; // TypeScript knows user is non-null
}
```

### Schema Inference with Zod

```typescript
// Best: Use Zod for runtime validation + type inference (alphabetically sorted)
const createUserSchema = z.object({
  age: z.number().int().positive(),
  email: z.string().email(),
  name: z.string().min(1),
});

// Infer the type from schema
type CreateUserInput = z.infer<typeof createUserSchema>;

// Extract repeated types for reusability
type CreateUserPayload = {
  age: number;
  email: string;
  name: string;
};

// Use extracted types in multiple places
const mutation = useMutation({
  mutationFn: (data: CreateUserPayload) => api.createUser(data),
});

// Use in function with runtime validation
function createUser(input: CreateUserInput) {
  // Input is already typed and can be validated
  const validated = createUserSchema.parse(input);
  // ...
}

// Form validation with React Hook Form + Zod
const form = useForm<CreateUserInput>({
  resolver: zodResolver(createUserSchema),
});
```

### Modern TypeScript Patterns

```typescript
// satisfies operator - maintain literal types with type checking
const routes = {
  home: '/',
  about: '/about',
  contact: '/contact',
} satisfies Record<string, string>;
type Route = keyof typeof routes; // 'home' | 'about' | 'contact'

// Template literal types
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiEndpoint = `/api/${string}`;
type ApiRoute = `${HttpMethod} ${ApiEndpoint}`;
const route: ApiRoute = 'GET /api/users'; // Type-safe!

// Const type parameters - preserve literal types
function getConfig<const T>(config: T): T {
  return config;
}
const config = getConfig({ port: 3000, host: 'localhost' });
// Type is { readonly port: 3000; readonly host: 'localhost' }

// Const assertions on arrays
const COLORS = ['red', 'green', 'blue'] as const;
type Color = (typeof COLORS)[number]; // 'red' | 'green' | 'blue'

// Type predicate functions
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value && 'name' in value;
}

// Usage with type narrowing
if (isUser(data)) {
  console.log(data.name); // TypeScript knows data is User
}

// Exhaustive checks with never
type Status = 'pending' | 'success' | 'error';

function handleStatus(status: Status): string {
  switch (status) {
    case 'pending':
      return 'Loading...';
    case 'success':
      return 'Done!';
    case 'error':
      return 'Failed!';
    default:
      // This ensures all cases are handled
      const _exhaustive: never = status;
      return _exhaustive;
  }
}
```
