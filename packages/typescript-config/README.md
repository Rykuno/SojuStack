# `@package/typescript-config`

Shared TypeScript configuration presets for the Partytrick monorepo.

## Overview

This package provides a strict-by-default TypeScript configuration foundation with environment-specific presets for different parts of the monorepo. All presets extend `base.json` which enforces maximum type safety, while allowing individual packages to override settings that conflict with their specific requirements.

## Available Presets

- `base.json`: Foundation for all presets. Strict type checking and code quality rules.
- `nestjs.json`: Backend API services. CommonJS modules, decorators, ES2023 target. Sets `verbatimModuleSyntax: false` for CommonJS compatibility.
- `node.json`: Node.js packages and scripts. NodeNext resolution, ES2023 target.
- `react-library.json`: React component libraries. React JSX, ESNext modules.
- `vite.json`: Frontend Vite apps. ESNext modules, bundler resolution, DOM types.

## Usage

First, add the package as a dev dependency:

```json
{
  "devDependencies": {
    "@package/typescript-config": "workspace:*"
  }
}
```

Then extend the appropriate preset in your `tsconfig.json`:

```json
{
  "extends": "@package/typescript-config/vite.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### When to Override

Only override when absolutely necessary:

- **Build output paths**: `rootDir`, `outDir` for packages that compile
- **Project-specific paths**: Path mappings for local imports
