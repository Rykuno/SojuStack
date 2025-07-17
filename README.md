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

For more control over the setup process, run the following in the order listed at the root of the project.

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

## E2E Typesafety

When developing applications with a smaller team(or solo) that tends to pivot, E2E typesafety is pretty imparative to develop with confidence. This stack acheives E2E type-safety through a few different means,
1) A monorepo where types can be shared.
2) OpenAPI(Swagger) docs actively generated.
3) OpenAPI-Fetch client on the frontends.

**There is no need to regnerate types in the SojuStack, this is done automatically.** The only necessity is to ensure DTO's have their correct OpenAPI annotations. 

This is achieved by a non-blocking helper function that listens and regenerates the `openapi.d.ts` file upon any changes - instantly reflecting on all frontend clients. Go ahead, change an endpoint or DTO in NestJS and view the errors in the frontend clients.

## Whats Inside and Why?

Hopefully this helps understand my logic and reasoning behind my choices in technology.

### Axioms
1) Does it solve the problem?
2) Is it tested, stable, well documented, and battle-proven?
3) No lock-in or ability to migrate away from the choice at anytime.
4) Will it scale with my needs? 
5) Is the DX well thought out?

### Backend
#### NestJS (Framework)
NestJS is the first to check all of the boxes above. It's on its v11 release, its proven itself for over a decade, it's incredibly easy to scale with many options available, and its documentation is fantastic.

It gets a bad rap in the node world for being verbose or from those who hate "OOP" in a "functional language". I for one embrace OOP in JS as it naturally documents your applications domain and business logic, keeps your application easily testable, and idk...its the way I mentally model things already so it translates well in my case. Also, have you ever written a monad? 

Testability is also a massive incentive for building in NestJS. I'm not the largest fan of TDD or unit testing, but in some cases it sure does come in handy. And when you finally have the needs to write tests, you'll be thankful for an environment that makes it painless.

#### Postgres (Database)
I'm a relational database type of guy. NoSQL databases have their role and place in the world but by large and whole you can't go wrong with Postgres. The only other real option is MySQL, which has some benefits, but in my experience I always end up wanting to reach for a feature or plugin it lacks.

#### Prisma (ORM)

> First, I'd love to choose Drizzle but its a pre-v1.0 release with limited production usage. In addition, they're apparently doing a full re-write of its core kit. Maybe in a couple years I'll check back on it. Prisma is also catching up to it...quickly.

I'm a fan of writing SQL, i'm actually well versed in it - but I've also worked in sizable projects without ORM'S. In my experience, if you don't use an ORM you end up building one. And the one you build isn't going to be nearly as good as one thats maintained by a community. <ins>What I look for in an ORM is its feature/ability to break out of it at anytime and just write SQL, ideally in a type-safe environment, should push come to shove.</ins> Most offer this, but some do it better than others. Prisma is FANTASTIC at this. 

This **fantastic** ORM gets a bad rap for both a very good and a very terrible reason. The main complaint people have about prisma is that it was "slow" - but it's not. 

When people hear Prisma is slow they just presume its because of unoptimized generated queries. In reality, Prisma had a rust binary as a dependency that required recompilation on startup. This was very noticeable in serverless environments when cold-starts were required. This lead to an echo chamber of people repeating "prisma is slow" online without actually understanding the issue.

Only problem here is that you only require a cold start in a serverless environment if you have no users generally - lol. Those of us who ran in VPS environments did not notice this at all.

Modern day prisma supports native joins, has removed the rust binary in favor of a 100% typescript engine, and is incredibly active on their socials in staying engaged with the community. 

#### Redis (Cache)

Substitute this for ValKey if you wish. The cache manager in NestJS uses KeyV as an interface so the only migration needed it to change the URL.

#### Better-Auth (Auth)

I'm a fan of "roll your own auth, not your own encryption". Its really not that hard to setup, but after evaluating Better-Auth I feel comfortable enough to include it as my auth solution. It does what I need it to do, provides an adequate level of abstraction, then gets out of the way. I've tested implementing better-auth then migrating away to a "self-rolled" auth and its **incredidbly** simple which gives me more confidence to build with it.

#### MinIO (Storage)

Minio is just self-hosted open source storage. Its fully S3 compatible so if you ever wanna switch over, its just a url change. The reason im a fan of MinIO is it keeps me out of the AWS console, lets me emulate my entire stack locally, and I can throw it on any VPS right next to my other services. Throw a CDN infront of it and it's quicker than S3.

### Frontend

#### Tanstack Start (Framework)

I was hesitant to build ontop of this as its pre v1.0 release, but after seeing how far its come in such a short amount of time, the "breaking changes" guide being so incredibly well updated and documented, and its DX - its too good to let go. 

This is the ONLY pre-release tech i'm willing to bet on for production at this time. I left for Svelte after seeing the direction of React and the horrific war-crimes Vercel/NextJS committed. TanStack Start brought me back to React.

#### Tanstack Query (Data Fetching)

IDK what to say on this one, its obvious. If you remember what life was like before Tanstack Query having to fetch data with redux/thunks - you'd be a donator to the project like I am. 

#### ShadCN (UI)

I have no preference in UI components. Use what you like and there's not really a wrong answer - this is purely what you enjoy and don't let anyone tell you differently. I use ShadCN for the same reasons i mentioned about every other tech above. It does what I need, gets out of my way when I want it to, and I can easily migrate away from it without fear of lock-in. 