# Agent Guidelines

## Project Structure

- **Backend**: `apps/api/` - NestJS with Drizzle ORM
- **Frontend**: `apps/web/` - TanStack Start
- **Shared**: `packages/typescript-config/` - Shared TypeScript configs

## Frontend

### Routing (TanStack Start)

- Use Tanstack Start best practices

### Data Fetching (TanStack Query)

- Query keys: `['resource', id, 'sub-resource']`
- Use `invalidateQueries()` without parameters

### Forms (TanStack Forms)

- Use `useForm()`, ShadCN Field components (`Field`, `FieldLabel`, `FieldError`), `form.useField()` for fields

### UI Components (ShadCN + BaseUI)

- Components: `apps/web/src/components/ui/` - ShadCN
- Prefer BaseUI primitives over raw html (`@base-ui/react`)
- Utils: `apps/web/src/lib/utils.ts` - `cn()` helper
- Tailwind CSS with ShadCN design tokens

### Type Safety

- E2E types: `apps/api/generated/openapi.d.ts` (auto-generated)

### Creating Routes/Components

- Routes: `apps/web/src/routes/{path}.tsx` with `createFileRoute()`
- Components: `apps/web/src/components/` using ShadCN UI + `cn()`

## Backend

### Database

- Schema: `apps/api/src/databases/drizzle.schema.ts`
- Tables: `apps/api/src/databases/tables/*.table.ts`
- Utils: `apps/api/src/databases/drizzle.utils.ts`
- Provider: `apps/api/src/databases/drizzle.provider.ts`

### Authentication

- Provider: `apps/api/src/auth/better-auth.provider.ts`
- Guard: `apps/api/src/auth/guards/auth.guard.ts`
- Decorators: `@Auth()`, `@ActiveUser()`, `@ActiveSession()`

### Transactions

- Use `@Transactional()` decorator
- Inject `TransactionHost<DrizzleTransactionClient>`
- Don't manually wrap with `tx.transaction()`

### Services

- Providers for external clients (Better Auth, Drizzle)
- Services handle business logic
- Export providers with `Inject*()` helpers

### Error Handling

- Use NestJS exceptions (`NotFoundException`, `UnauthorizedException`, etc.)

### Type Safety

- E2E types: `apps/api/generated/openapi.d.ts` (auto-generated)
- Use `Serialize` decorator for DTO transformation

### Creating Tables

1. Create `apps/api/src/databases/tables/{name}.table.ts`
2. Export from `drizzle.schema.ts`
3. Add relations in `drizzle.relations.ts`

## Important Notes

- Don't nest transactions - use `@Transactional()` decorator
- Avoid `as any` - use proper types or `as` with specific types
