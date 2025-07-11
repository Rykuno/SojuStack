# SojuStack

My constantly updated opinionated stack for constructing new Fullstack(Web/Mobile/Backend) applications.

## Getting Started

I've provided both automated and manual setup options to fit your workflow.

### 🚀 Quick Start (Automated)

Only use quick-start for trying the stack out initially. Don't use this during actual development.

```sh
$ pnpm dev:setup
```

### 🛠️ Manual Setup (Recommended)

For more control over the setup process:

```sh
# 1. Create environment files
$ cp apps/api/.env.example apps/api/.env
$ cp apps/web/.env.example apps/web/.env

# 2. Install dependencies
$ pnpm install

# 3. Start Docker services
$ docker-compose up -d

# 4. Setup database
$ pnpm -C ./apps/api db:push

# 5. Start development servers
$ pnpm dev
```

#### Default Service URLs

```
web: http://localhost:3000
api: http://localhost:8080
mailpit: http://localhost:8025
postgres: postgres://postgres:postgres@localhost:5432/postgres
redis: redis://localhost:6379
minio: http://localhost:9000
```

## What's inside?

### Apps and Packages

- Api:
  - Framework: NestJS
  - Auth: Better-Auth
  - Databases:
    - Redis
    - Postgres
  - Storage: MinIO(S3 compatible)
- Web:
  - Framework: Tanstack Start
  - Data Fetching: Tanstack Query

Each package/app is and should be 100% [TypeScript](https://www.typescriptlang.org/).
