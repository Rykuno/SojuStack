# Git Workflow Instructions

Git workflow and commit conventions for the monorepo.

## Branching Strategy

We follow Git Flow branching model.

### Branch Types

**`main`** - Production code (protected)

- Never commit directly
- Only receives merges from release and hotfix branches

**`develop`** - Integration branch (protected)

- Never commit directly
- All features merge here first

**`feature/*`** - New features and enhancements

- Branch from: `develop`
- Merge to: `develop`
- Naming: `feature/[issue-id]-description` or `feature/description`
- Deleted after merging
- Note: Also used for chores, refactors, and other non-feature work

**`release/*`** - Prepare for production

- Branch from: `develop`
- Merge to: `main` and `develop`
- Naming: `release/vX.Y.Z`
- Only bug fixes allowed, no new features

**`hotfix/*`** - Emergency production fixes

- Branch from: `main`
- Merge to: `main` and `develop`
- Naming: `hotfix/vX.Y.Z` or `hotfix/[issue-id]-description`

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

The entire first line must be ≤50 characters (type + scope + subject).

### Format

```
<type>(<scope>): <subject>    ← ENTIRE LINE ≤50 CHARACTERS

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                                         |
| ---------- | --------------------------------------------------- |
| `feat`     | New feature                                         |
| `fix`      | Bug fix                                             |
| `docs`     | Documentation only                                  |
| `style`    | Formatting, no code change                          |
| `refactor` | Code change that neither fixes bug nor adds feature |
| `perf`     | Performance improvement                             |
| `test`     | Adding or correcting tests                          |
| `build`    | Build system or dependency changes                  |
| `ci`       | CI configuration changes                            |
| `chore`    | Other changes that don't modify src or test         |
| `revert`   | Reverts a previous commit                           |

### Scope (Optional)

Common scopes: `api`, `web`, `ui`, `auth`, `db`, `deps`, `config`

- Omit scope for changes affecting multiple areas
- Use kebab-case for multi-word scopes (e.g., `user-auth`)

### Subject Rules

1. **50 character limit** for entire first line: `<type>(<scope>): <subject>`
2. **Lowercase start**: `feat: add user auth` not `feat: Add user auth`
3. **Imperative mood**: "add" not "adds" or "added"
4. **No period** at the end
5. **Blank line** required between subject and body

**Quick check:** Write the full line and count characters. If >50, shorten it.

### Examples

```bash
# Good (under 50 chars)
feat(api): add user auth                     # 24
fix(web): resolve login bug                  # 27
refactor(config): update ts settings         # 36

# Bad (over 50) → Fixed
refactor(config): reorganize typescript configuration # 54 ❌
refactor(config): reorganize ts config       # 38 ✅
```

### Body (Optional)

- Explain **why**, not how (implementation is in the code)
- **72 characters max per line** (hard limit, count ALL characters including spaces)
- MUST have a blank line between subject and body (no exceptions)
- Each line in the body must be ≤72 characters

### Footer (Optional)

- Issue references: `Closes #123`
- Breaking changes: `BREAKING CHANGE: description` or `!` after type
- Co-authors: `Co-authored-by: name <email>`

### Shortening Strategies

When your commit message is too long, try these:

1. **Shorten the scope**: `user-management` → `users`, `authentication` → `auth`
2. **Use abbreviations**: `configuration` → `config`, `typescript` → `ts`
3. **Be more concise**: `implement profile picture uploads` → `add profile pics`
4. **Remove filler words**: `establish strict` → `lockdown`, `resolve issues` → `fix`
5. **Consider dropping scope**: If it makes the message clearer and shorter

## Pre-commit Hooks

Automated code quality checks run on every commit via Lefthook.

### What Runs Automatically

1. **oxlint** - Auto-fixes linting issues on staged JS/TS files
2. **prettier** - Formats staged files (JS, TS, JSON, MD, YAML, CSS)

These run sequentially (oxlint first, then prettier) to avoid conflicts.

### Manual Checks Before Pushing

While pre-commit hooks handle formatting and linting, run these manually before pushing:

```bash
pnpm tc  # or pnpm typecheck - ensure no type errors
```

The CI pipeline will catch any issues, but checking locally saves time.

## Workflow Commands

```bash
# Feature work
git checkout -b feature/description develop
git push -u origin feature/description

# Release (maintainers only)
git checkout -b release/v1.2.0 develop
git merge --no-ff release/v1.2.0  # to main & develop

# Hotfix (maintainers only)
git checkout -b hotfix/v1.2.1 main
git merge --no-ff hotfix/v1.2.1   # to main & develop
```

## Version Control

Follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

- Breaking changes increment MAJOR
- New features increment MINOR
- Bug fixes increment PATCH

Tag format: `v1.2.3`

## Critical Git Rules

**NEVER use `git add -A` or `git add .`** - Always stage specific files deliberately

```bash
git add <specific-files>      # Stage deliberately
git add -p                    # Interactive staging
git diff --cached            # Review before committing
```

**Commit frequently**: After each logical change, not at task end
**Keep atomic**: One change per commit
**Check secrets**: Never commit API keys, tokens, passwords

## Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Git Flow](https://danielkummer.github.io/git-flow-cheatsheet/)
