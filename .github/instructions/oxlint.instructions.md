# Oxlint Instructions

Fast, focused linting for real bugs.

## Configuration Philosophy

`.oxlintrc.json`

Only `correctness`, `suspicious`, and `perf` categories enabled as errors. Everything else is off to focus on actionable issues.

## Key Disabled Rules

```jsonc
// React perf rules - 166+ instances
"react-perf/jsx-no-new-object-as-prop": "off",
"react-perf/jsx-no-new-array-as-prop": "off",
"react-perf/jsx-no-new-function-as-prop": "off",

// Valid patterns
"import/no-namespace": "off",  // Radix UI requirement
"import/no-unassigned-import": "off",  // Side-effects
"no-console": "off",  // Dev logging
```

## NestJS Overrides

- `new-cap`: off for decorators
- `no-extraneous-class`: allows decorator pattern

## Auto-Fixable

With `--fix` flags: import organization, equality operators, arrow functions, braces, unnecessary code.

## Usage

```bash
pnpm lint          # Check for issues
pnpm fix           # Auto-fix issues
```

Pre-commit hooks automatically run `oxlint --fix` on staged files.

## Resources

- [Oxlint Rules](https://oxc.rs/docs/guide/usage/linter/rules)
- [Configuration Guide](https://oxc.rs/docs/guide/usage/linter/config)
