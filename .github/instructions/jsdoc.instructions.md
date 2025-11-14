---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---

# JSDoc Documentation Guidelines

## Important for AI Assistants

Use JSDoc for descriptions only - let TypeScript handle types. Document public APIs, complex logic, and non-obvious behavior. Never include type annotations in JSDoc comments.

## When to Document

**Always document:**

- Exported functions, hooks, and components
- Complex algorithms or non-obvious logic
- Functions with side effects or special behaviors

**Skip documentation for:**

- Private functions
- Simple getters/setters
- Self-explanatory code

## Format Rules

- No type annotations (`@param {string}` ❌)
- Use `@param` and `@returns` for descriptions only
- Include `@example` for complex functions
- Keep descriptions concise (1-2 lines)
- Explain "why" not "what"
- Use `@deprecated` when replacing functions
- Use `@throws` only for non-obvious errors
- Single-line for simple descriptions
- Use `@todo` in JSDoc for planned improvements

## Examples

```typescript
/**
 * Formats a number as USD currency.
 *
 * @param amount - The number to format
 * @returns Formatted currency string
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 */
export function formatCurrency(amount: number): string {
  // implementation
}

/**
 * Debounced search input with loading states.
 * Cancels pending requests on new input.
 */
export function SearchInput({ onSearch }: SearchInputProps) {
  // implementation
}

/**
 * Manages form state with validation and auto-save.
 * @example
 * const { values, errors } = useForm(initialValues);
 */
export function useForm<T>(initial: T) {
  // implementation
}

/** Maximum file size in bytes (10MB). */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * @deprecated Use {@link createUser} instead
 */
export function addUser(data: UserData) {
  // implementation
}

/**
 * Sends email notifications to users.
 * @todo Add rate limiting to prevent abuse
 * @todo Implement retry logic for failed sends
 */
export async function sendEmail(to: string, body: string) {
  // implementation
}
```

## Don'ts

```typescript
// Bad: Type annotations
/** @param {string} name */

// Bad: Obvious documentation
/** Gets the name */
function getName() {
  return this.name;
}

// Bad: Implementation details
/** Uses regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/ to validate */
```
