![logo](./stack-logo.png)

# SojuStack

Opinionated, production-minded full-stack starter with strong TypeScript ergonomics, end-to-end type safety, and a modern local-first developer workflow.

Human-first by design: this stack is built for developers to lead decisions, with AI used as an accelerator for implementation, iteration, and review.

## Tech Stack

### Monorepo and Tooling

- `Vite+` as the unified CLI and workflow layer
- `pnpm` under the hood via `Vite+`
- `TypeScript` across the entire monorepo
- `Oxlint` + `Oxfmt` through `vp check`
- Git hook integration via `vp config`

### Web (`apps/web`)

- `TanStack Start` + `TanStack Router`
- `React 19`
- `TanStack Query`, `TanStack Form`, and `TanStack Table`
- `openapi-fetch` with generated API types from the backend
- `Tailwind CSS v4` + `shadcn/ui` + `@base-ui/react`
- `better-auth` client integration
- Built-in local devtools for OpenAPI, Drizzle, Mailpit, React Email, RustFS, and TanStack Query

### API (`apps/api`)

- `NestJS` 11
- `Drizzle ORM` + `drizzle-kit`
- `PostgreSQL`
- `Valkey`/Redis-compatible caching via `Keyv`
- `BullMQ` queues
- `Better Auth`
- `React Email` templates with `Mailpit` and `Resend` transports
- OpenAPI generation with `@nestjs/swagger` + `openapi-typescript`
- `RustFS` for S3-compatible object storage

### Local Infra (`docker-compose.yaml`)

- `Postgres`
- `Valkey`
- `Mailpit`
- `RustFS`

## Architecture

```mermaid
flowchart LR
  U[User] --> W[Web App<br/>TanStack Start]
  W -->|HTTP + Cookies| A[API<br/>NestJS]
  A --> P[(PostgreSQL)]
  A --> V[(Valkey)]
  A --> Q[BullMQ Jobs]
  A --> S[(RustFS / S3-compatible)]
  A --> E[Mailpit / Resend]
```

## Type-Safe Flow

```mermaid
sequenceDiagram
  participant FE as Web
  participant API as NestJS API
  participant OAS as OpenAPI Types

  FE->>API: Request typed by openapi-fetch client
  API-->>FE: Response typed by generated schema
  API->>OAS: Generate/update openapi.d.ts
  OAS-->>FE: Compile-time contract updates
```

## Getting Started

### Prerequisites

- `Node.js 25.8.2`
- Docker
- `vp` installed globally

### Setup

```sh
# 1) Create env files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 2) Install dependencies
vp install

# 3) Start local infrastructure
docker compose up -d

# 4) Apply the database schema
vp run api#db:push

# 5) Start the full dev environment
vp run dev
```

`vp run dev` starts the web app, the NestJS API in watch mode, the React Email preview server, and Drizzle Studio from the API workspace.

## Storage Model

The API storage layer uses two buckets: `public` and `private`.

Public files are stored in the public bucket and returned from the API as flat relative keys like `user-avatar-user-id`. Compose the final URL in the web app with `VITE_STORAGE_URL`, for example `http://localhost:9000/public/user-avatar-user-id`.

Private files stay backend-only and should be read through the API instead of being linked directly.

## Default Local Endpoints

```txt
web:                http://localhost:3000
api:                http://localhost:8000
react-email:        http://localhost:3030
mailpit:            http://localhost:8025
postgres:           postgres://postgres:postgres@localhost:5432/postgres
valkey:             redis://localhost:6379
rustfs api:         http://localhost:9000
rustfs console:     http://localhost:9001
```

## Common Commands

```sh
vp install                     # install dependencies
vp check                       # format, lint, and type-check
vp test                        # run tests where supported by Vite+
vp run dev                     # start web + api development tasks
vp run build                   # build the web and api apps
vp run api#db:push             # push Drizzle schema to the database
vp run api#db:studio           # open Drizzle Studio
vp run api#openapi:generate    # regenerate committed OpenAPI types
vp ready                       # project-wide format/lint/test/build pass
```

## End-to-End Type Safety

SojuStack keeps API and frontend contracts aligned by default:

- Shared monorepo context
- OpenAPI docs and generated type definitions
- Typed frontend requests through `openapi-fetch`

In practice: update a DTO or route in the API and frontend compile errors surface immediately where contracts changed.

`apps/api/generated/openapi.d.ts` is a committed artifact and the source of truth consumed by the web app. After changing API contracts, run `vp run api#openapi:generate` and commit the updated file.

## Why This Stack

### Axioms

1. Does it solve the problem?
2. Is it battle-tested and documented?
3. Can I migrate away without pain?
4. Does it scale with me?
5. Is the developer experience actually good?
6. Does it work well with AI?

### Backend

#### NestJS

It checks all the boxes: mature, structured, testable, and easy to grow. Explicit architecture wins when business logic gets real.

#### PostgreSQL + Drizzle

Postgres gives excellent defaults and long-term headroom. Drizzle keeps the data layer SQL-first, typed, and reviewable without a huge abstraction tax.

#### Better Auth

Authentication should be boring and dependable. Better Auth moves quickly without boxing the project into a dead-end auth layer.

#### Queues, Cache, and Mail

Valkey, BullMQ, Mailpit, and React Email make it straightforward to build background jobs and transactional email flows locally before swapping in hosted services.

#### RustFS

S3-compatible object storage keeps local development realistic and future migration low-friction.

### Frontend

#### TanStack Start

TanStack Start provides a strong routing model, solid SSR-oriented ergonomics, and a clean foundation for typed, full-stack React apps.

#### Tailwind + shadcn/ui + Base UI

Composable primitives, fast iteration, and no hard lock-in to a black-box component library.

### Tooling

#### Vite+

Vite+ gives the repo a single command surface for installs, checks, tests, builds, and workspace task execution, which keeps the day-to-day workflow much simpler than mixing separate package-manager and task-runner commands.

#### Type-Safe Contracts

The API owns the schema, generated OpenAPI types are committed, and the frontend consumes that contract directly.
