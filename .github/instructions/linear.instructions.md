# Linear Instructions

Linear is our issue tracker. GitHub is for code/PRs only.

**Team**: Partytrick  
**Issue prefix**: PAR-XXX

## Integration Patterns

- Branch: `feature/PAR-123-description`
- PR description: Reference `PAR-123` (use `Resolves` only if PR fully completes the issue)
- Status updates automatic via GitHub integration

## Commands Reference

```bash
# When you need Linear context
mcp__linear-server__get_issue --id "PAR-123"
mcp__linear-server__list_my_issues
mcp__linear-server__list_issues --query "keyword"

# Issue management
mcp__linear-server__create_issue --team "Partytrick" --title "..."
mcp__linear-server__update_issue --id "PAR-123" --state "In Progress"
mcp__linear-server__create_comment --issueId "..." --body "..."
```
