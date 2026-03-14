# Frontend Contract Rules

Use this reference when touching `apps/web` code that talks to the API, importing from `api/generated/openapi`, changing `apps/web/src/lib/api-client.ts`, or adapting the web app to backend contract changes.

## Goals

- Keep one transport contract across `apps/api` and `apps/web`.
- Make the shared API client the default path for request behavior.
- Keep API shaping logic out of presentational UI code.

## Required Defaults

- Treat `apps/api/generated/openapi.d.ts` as the source of truth for API request and response shapes.
- Import generated types from `api/generated/openapi`.
- Prefer `apps/web/src/lib/api-client.ts` for HTTP transport behavior, credentials, forwarded headers, and error handling.
- Add resource-level wrappers in `apps/web/src/lib/api/` when a feature needs reusable calls, query options, or mutations.
- Prefer inferred return types from the shared client and API wrappers instead of explicitly annotating fetched response types.
- Keep transport and contract logic in API helpers, route boundaries, or query helpers instead of in presentational UI code.

## Avoid These Mistakes

- Do not define duplicate transport types in `apps/web` when the generated contract already describes the payload.
- Do not introduce ad hoc `fetch` calls just to avoid using the shared client.
- Do not hardcode API URLs, credentials, or header forwarding in feature code.
- Do not add explicit return type annotations like `Promise<MyDto>` to API wrapper methods when inference from the generated client already provides the correct type.
- Do not hide contract mismatches with `as` casts or hand-written fallback types.
- Do not shape API payloads inline in presentational components if the logic belongs in an API helper, query helper, or route boundary.

## Preferred Shape

1. Keep transport details in `apps/web/src/lib/api-client.ts`.
2. Keep feature-specific API wrappers in `apps/web/src/lib/api/{resource}.ts`.
3. Expose reusable query options, mutation helpers, or small typed methods from those wrappers.
4. Let routes and components consume those helpers instead of rebuilding the contract boundary each time.

## File-Level Guidance

### `apps/web/src/lib/api-client.ts`

- Extend this file when request behavior must change globally.
- Keep credentials, forwarded headers, and shared error handling centralized here.
- Avoid bypassing this file unless the use case is impossible to express through the shared client.

### `apps/web/src/lib/api/*.ts`

- Wrap backend resources behind small, typed feature APIs.
- Reuse generated types instead of redefining request and response shapes.
- Let API wrapper return types flow from the generated client call chain unless an explicit annotation is required for a non-transport abstraction.
- Keep query keys stable and predictable.
- Co-locate query option helpers with the resource wrapper when that reduces duplication.

## Cross-Stack Changes

When backend work changes a public API contract:

1. Update the backend DTO, serialization, and Swagger-visible shape first.
2. Refresh the generated OpenAPI output.
3. Update web imports and wrappers to the new generated types.
4. Fix usage sites after the contract boundary is correct.

## When a Local Type Is Acceptable

Create a local type only when it is intentionally not the transport contract, such as:

- derived UI state
- grouped form state
- component-only display models
- merged data from multiple API calls

Do not use a local type to mirror a backend DTO one-to-one.
