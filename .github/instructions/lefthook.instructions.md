# Lefthook Instructions

Fast, native Git hooks manager for automated code quality checks.

## Configuration

`.lefthook.json`

### Pre-commit Hooks

Runs automatically on `git commit`:

1. **oxlint** - Auto-fixes linting issues on staged files
2. **prettier** - Formats staged files

Both run sequentially to avoid conflicts. Fixed files are automatically re-staged.

## Features

- **Native performance** - Written in Go, no Node.js overhead
- **Staged files only** - Uses `{staged_files}` to target only what's being committed
- **Silent operation** - No output on success, verbose on failure
- **Auto-staging** - `stage_fixed: true` re-stages modified files

## Manual Control

```bash
# Skip hooks for a single commit
git commit --no-verify

# Run hooks manually
lefthook run pre-commit
```

## Resources

- [Lefthook Documentation](https://lefthook.dev/)
- [Configuration Reference](https://lefthook.dev/configuration/)
