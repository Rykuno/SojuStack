# Instructions Directory Overview

This directory contains all instruction files that guide AI assistants and developers in maintaining consistent code quality and following established patterns.

## Documentation Flow

```mermaid
graph TD
    CLAUDE[CLAUDE.md<br/>symlink]
    CURSOR[.cursorrules<br/>symlink]
    COPILOT[.github/copilot-instructions.md<br/>symlink]
    HUMAN[Developer<br/>Real Human]

    AGENT[AGENT.md<br/>Central Source]

    CLAUDE --> AGENT
    CURSOR --> AGENT
    COPILOT --> AGENT
    HUMAN --> AGENT

    INST[Instruction Files<br/>typescript.md, react.md, etc.]
    README[README Files<br/>Project & Package docs]
    CODE[Code Examples<br/>Tests, Stories, Patterns]

    AGENT --> INST
    AGENT --> README
    AGENT --> CODE

    style CLAUDE fill:#fafafa,stroke:#222,stroke-width:1px,stroke-dasharray: 5 5,color:#222
    style CURSOR fill:#fafafa,stroke:#222,stroke-width:1px,stroke-dasharray: 5 5,color:#222
    style COPILOT fill:#fafafa,stroke:#222,stroke-width:1px,stroke-dasharray: 5 5,color:#222
    style HUMAN fill:#fafafa,stroke:#222,stroke-width:2px,color:#222
    style AGENT fill:#fafafa,stroke:#222,stroke-width:3px,color:#222
    style INST fill:#fafafa,stroke:#222,stroke-width:1px,color:#222
    style README fill:#fafafa,stroke:#222,stroke-width:1px,color:#222
    style CODE fill:#fafafa,stroke:#222,stroke-width:1px,color:#222
```

Each AI assistant tool enters through its own symlink, but they all point to the central `AGENT.md` file. This central file acts as the single source of truth that references the appropriate documentation without duplicating content.

## Documentation Philosophy

### Structure

- **AGENT.md**: Central source of truth, index pointing to resources, not duplicating content
- **Instruction files** (.github/instructions/\*.instructions.md): Language/framework-specific rules and patterns
  - All instruction files must follow the naming pattern `*.instructions.md`
  - Examples: `git.instructions.md`, `typescript.instructions.md`, `react.instructions.md`
- **README files**: Setup, usage, and overview information
  - Root README: Project overview and quick start
  - App/package READMEs: Specific setup and usage for that module
- **Code examples**: Actual implementation patterns (stories, tests, example components)

### Principles

- Each document has ONE clear purpose
- Avoid duplicating information across files
- Reference other docs instead of repeating content
- More specific docs deeper in directory tree
- Keep instructions actionable and concise

## Keep Documentation Updated

**When making architectural changes or adding new tools/patterns:**

1. Update the relevant documentation files to reflect changes
2. This ensures all AI assistants have accurate, current information
3. Include: new commands, changed workflows, updated dependencies, new patterns
4. Remove: deprecated commands, old patterns, removed dependencies

Examples of changes that require updates:

- Adding/removing packages or dependencies
- Changing build/test commands
- Modifying project structure
- Updating development workflows
- Changing environment variables or ports
- Adopting new conventions or patterns

## How to Add New Instruction Files

1. Create a new file following the naming pattern: `<topic>.instructions.md`
2. Focus on ONE specific technology or pattern
3. Include practical examples and clear guidelines
4. Update AGENT.md to reference the new instruction file
