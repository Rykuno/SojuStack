# pnpm Instructions

Package management for our monorepo.

## Core Commands

```bash
pnpm install              # Install all dependencies
pnpm add <pkg> --filter <workspace>  # Add to specific workspace
pnpm add -D <pkg> -w      # Add dev dependency to root
```

## Workspace Filters

```bash
--filter @partytrick/api  # Specific workspace
--filter "./apps/*"       # All apps
--filter "@partytrick/*"  # All our packages
```

## Catalog Dependencies

Reference shared versions in `package.json`:

```json
{
  "dependencies": {
    "react": "catalog:"
  }
}
```

## Important Rules

- **Always use pnpm** - Never npm, yarn, or bun
- **Install from root** - Ensures proper workspace linking
- **Use catalog versions** - When dependency is listed in workspace catalog
- **Explicit dependencies only** - Never import transitive dependencies

## Common Patterns

```bash
# Add to specific app
pnpm add axios --filter @partytrick/api

# Update interactively
pnpm update --latest --interactive

# Clean install
rm -rf node_modules && pnpm install
```

## Resources

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [pnpm Catalogs](https://pnpm.io/catalogs)
