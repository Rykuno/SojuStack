# Backend Auth And Transactions

Use this reference when touching Better Auth setup, auth-protected controllers, session or user access patterns, transaction boundaries, services, or expected error handling in `apps/api`.

## Better Auth

- Follow the existing Better Auth setup in `apps/api/src/auth/better-auth.provider.ts`.
- Reuse established auth hooks, providers, and module wiring before introducing new auth abstractions.
- Use framework auth helpers such as `@Auth()`, `@ActiveUser()`, and `@ActiveSession()` instead of ad hoc request parsing.

## Transactions

- Use `@Transactional()` with `TransactionHost<DrizzleTransactionClient>`.
- Do not manually start or nest transactions with `tx.transaction()`.
- Keep transaction boundaries in the service layer unless an existing local pattern says otherwise.

## Services

- Keep controllers thin; place business logic in services or providers.
- Prefer small cohesive service methods over mixing transport concerns and business rules in controllers.
- Reuse existing providers and utilities before adding another abstraction layer.

## Errors

- Use NestJS exceptions such as `NotFoundException` and `UnauthorizedException` for expected failures.
- Keep expected domain failures explicit instead of returning ambiguous null-like responses.
