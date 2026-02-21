# SojuStack

Opinionated, production-minded full-stack starter with strong TypeScript ergonomics and end-to-end type safety.

Human-first by design: this stack is built for developers to lead decisions, with AI used as an accelerator for implementation, iteration, and review.

## Tech Stack

### Monorepo and Tooling

- `pnpm` workspaces
- `turbo` task orchestration
- `TypeScript` everywhere
- `oxlint` + `oxfmt`
- `lefthook` (pre-push checks)

### Web (`apps/web`)

- `TanStack Start` + `TanStack Router`
- `TanStack Query`
- `openapi-fetch` generated client types
- `Tailwind CSS` + `shadcn` + `@base-ui/react`
- `better-auth` client integration

### API (`apps/api`)

- `NestJS` (v11)
- `Drizzle ORM` + `drizzle-kit`
- `PostgreSQL`
- `Valkey`/Redis-compatible caching via `Keyv`
- `Better Auth`
- OpenAPI generation (`@nestjs/swagger` + `openapi-typescript`)

### Local Infra (`docker-compose.yaml`)

- `Postgres`
- `Valkey`
- `Mailpit`
- `RustFS` (S3-compatible object storage)

## Architecture

```mermaid
flowchart LR
  U[User] --> W[Web App<br/>TanStack Start]
  W -->|HTTP + Cookies| A[API<br/>NestJS]
  A --> P[(PostgreSQL)]
  A --> V[(Valkey)]
  A --> S[(RustFS / S3-compatible)]
  A --> M[Mailpit]
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

### Quick Trial (Automated)

Use this only for first-time trial runs:

```sh
pnpm dev:setup
```

### Manual Setup (Recommended)

```sh
# 1) Create env files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 2) Install dependencies
pnpm install

# 3) Start local infrastructure
docker-compose up -d

# 4) Apply DB schema
pnpm -C apps/api db:push

# 5) Start apps
pnpm dev
```

## Default Local Endpoints

```txt
web:      http://localhost:3000
api:      http://localhost:8080
mailpit:  http://localhost:8025
postgres: postgres://postgres:postgres@localhost:5432/postgres
valkey:   redis://localhost:6379
rustfs:   http://localhost:9000
```

## Common Commands (Root)

```sh
pnpm dev            # run web + api dev tasks via turbo
pnpm build          # build all packages
pnpm lint           # oxlint type-aware run
pnpm lint:fix       # apply lint fixes
pnpm typecheck      # turbo typecheck
pnpm format         # oxfmt
pnpm api:openapi:generate
```

## End-to-End Type Safety

SojuStack keeps API and frontend contracts aligned by default:

- Shared monorepo context
- OpenAPI docs and generated type definitions
- Typed API usage through `openapi-fetch`

In practice: update a DTO/route in API and frontend compile errors surface immediately where contracts changed.

## Why This Stack

### Axioms

1. Does it solve the problem?
2. Is it battle-tested and documented?
3. Can I migrate away without pain?
4. Does it scale with me?
5. Is the developer experience actually good?
6. Does it work well with AI(yeah, we're here so might as well)

### Backend

#### NestJS

It checks all the boxes for me: mature, structured, testable, and easy to grow.  
People call it verbose; I call it explicit. I prefer that when business logic gets real.

#### PostgreSQL

I'm a relational DB person. Postgres has the right defaults and enough headroom that I rarely regret choosing it.

#### Drizzle

This is the SQL-first ORM experience I actually enjoy.  
Minimal magic, typed queries, reviewable migrations, and no giant abstraction tax.

#### Valkey (Redis-compatible cache)

Simple, fast, and drop-in for Redis workflows.  
With `Keyv` in the API layer, swapping providers is mostly config-level work.

#### Better Auth

"Don't roll your own crypto" is still the rule.  
Better Auth gives enough abstraction to move fast without boxing me in.

#### RustFS (S3-compatible object storage)

Local-first, self-hostable, and S3-compatible.  
If I move to managed object storage later, it's mostly endpoint/credential changes.

### Frontend

#### TanStack Start + Router

Fantastic routing model and good long-term ergonomics.  
File-based routes + typed APIs make iteration fast and refactors safer.

#### TanStack Query

The default for server state in React apps for a reason.

#### shadcn + Base UI + Tailwind

Composable primitives, easy customization, and no hard lock-in to a black-box UI kit.

### Monorepo + Tooling

#### pnpm + Turbo

Fast workspace installs, clean task orchestration, and predictable monorepo workflows.

#### Oxlint + Oxfmt

Very fast lint/format feedback loops with type-aware checks where it matters.

#### Lefthook

Simple guardrails before push (`lint` + `typecheck`) so broken code is harder to ship.
