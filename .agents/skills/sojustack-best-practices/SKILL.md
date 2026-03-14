---
name: sojustack-best-practices
description: Repo-specific implementation guardrails for SojuStack-derived apps built with NestJS, Drizzle, Better Auth, and TanStack Start. Use when editing `apps/api` or `apps/web`, adding routes/controllers/DTOs/services, wiring frontend code to backend contracts, consuming `api/generated/openapi`, using `apps/web/src/lib/api-client.ts`, working with Better Auth helpers, or making cross-stack changes that must preserve end-to-end typing and shared client conventions.
---

# SojuStack Best Practices

Use this skill as the default contract for code generation in SojuStack and projects derived from it.

## Repository Map

- `apps/api/`: NestJS API, Drizzle ORM, Better Auth
- `apps/web/`: TanStack Start, TanStack Query, TanStack Form, Base UI, ShadCN
- `apps/api/generated/openapi.d.ts`: generated API contract consumed by the web app
- `apps/web/src/lib/api-client.ts`: default typed frontend HTTP client
- `packages/typescript-config/`: shared TypeScript config

## Non-Negotiables

- Keep scope tight to the user request; avoid opportunistic refactors.
- Maintain strict typing; avoid `any`, unsafe casts, and hand-wavy escape hatches.
- Match naming, file placement, and folder conventions already used in the touched area.
- Reuse existing providers, helpers, and patterns before adding abstractions.
- Preserve end-to-end typing across backend and frontend changes.
- Treat existing repo paths and conventions as defaults, not optional examples.
- If behavior changes, update or add the relevant tests.

## Workflow

1. Read nearby code and copy the local pattern before introducing anything new.
2. Classify the change as frontend-only, backend-only, or cross-stack.
3. If the API surface changes, update the backend source-of-truth shapes so generated OpenAPI types stay accurate.
4. Implement the smallest correct change.
5. Run repository validation commands from the repo root:
   - `pnpm typecheck`
   - `pnpm format`
   - `pnpm lint`
6. Fix failures and rerun until the touched area is clean.
7. Ensure unrelated files are not modified.
8. Report what changed, why, and how it was validated.

## Topic Guide

- Read `references/frontend-api-contracts.md` for generated OpenAPI usage, shared API client rules, and cross-stack frontend contract changes.
- Read `references/frontend-ui-routing.md` for TanStack Start route structure, TanStack Query and Form placement, and UI composition defaults.
- Read `references/backend-dto.md` for DTO, Swagger, serialization, and generated OpenAPI preservation rules.
- Read `references/backend-database.md` for Drizzle table placement, schema export rules, and relation updates.
- Read `references/backend-auth-transactions.md` for Better Auth usage, auth decorators, transaction boundaries, service layering, and NestJS error handling.

## References

- Keep topic-specific rules in `references/` instead of bloating `SKILL.md`.
- Add future focused references here when a topic becomes large enough to deserve its own file.
