# Prettier Instructions

Code formatting with automatic import organization and Tailwind class sorting.

## Configuration

`.prettierrc.json`

### `prettier-plugin-tailwindcss`

Automatically sorts classes based on Tailwind's recommended class order.

- Tailwind class sorting
- Consistent code formatting

### `prettier-plugin-organize-imports`

A plugin that makes Prettier organize your imports (i. e. sorts, combines and removes unused ones) using the organizeImports feature of the TypeScript language service API. This is the same as using the "Organize Imports" action in VS Code.

- Groups and sorts imports
- Removes unused imports
- Merges duplicate imports
- Respects TypeScript's organization rules

## Usage

```bash
pnpm format        # Format all files
```

Pre-commit hooks automatically run prettier on staged files.

## Resources

- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- [prettier-plugin-organize-imports](https://github.com/simonhaenisch/prettier-plugin-organize-imports)
