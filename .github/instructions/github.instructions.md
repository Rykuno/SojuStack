# GitHub CLI Instructions

GitHub CLI (`gh`) usage patterns for AI assistants working in the monorepo.

## Before Starting Work

Always check for existing context:

```bash
gh pr view                           # Current branch PR status
gh pr list --search "keyword"        # Find related PRs
gh pr diff <number>                  # Review PR changes
```

Note: We primarily use Linear for issue tracking. Check GitHub issues occasionally but focus on PR context.

## Creating Pull Requests

```bash
# Always create PRs to develop (never main!)
gh pr create --base develop --title "feat(scope): description"
```

**PR titles**: Max 72 chars, follow conventional commits format
**PR body**: Include summary, testing steps, and issue references (`Closes #123`)

## Linking Work

- For Linear issues: `PAR-123` in PR description
- For GitHub issues: `Closes #123` or `Fixes #123`
- For partial work: `Related to PAR-123`

## Reviewing PRs

When asked to review code:

```bash
gh pr list --author username          # Find their PRs
gh pr checkout <number>               # Check out PR locally
gh pr diff <number>                   # Review changes
gh pr comment <number> -b "feedback"  # Leave feedback
```

## Common Commands

```bash
# Check PR status
gh pr view                    # Current PR
gh pr checks                  # CI status
gh pr view --comments         # Review comments

# Debug failing CI
gh run list --workflow=CI     # See recent CI runs
gh run view                   # View last run details
gh run view --log-failed      # Show only failed job logs

# Get more context
gh api repos/:owner/:repo/pulls/<number>/files  # List changed files
gh pr view --json files --jq '.files[].path'    # Quick file list
gh repo view --json defaultBranchRef            # Check default branch
```

## Key Rules

- **Always** check for existing PRs first
- **Always** create PRs to `develop`, never `main`
- **Always** reference Linear issues (PAR-XXX) in PRs
- **Never** use `git add .` or `git add -A`
