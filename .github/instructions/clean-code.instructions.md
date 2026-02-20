---
applyTo: '**'
---

# Clean Code Guidelines

## Important for AI Assistants

Apply these principles to all code regardless of language or framework. These guidelines complement language-specific rules and should be followed universally.

## Constants Over Magic Numbers

- Replace hard-coded values with named constants
- Use descriptive constant names that explain the value's purpose
- Keep constants at the top of the file or in a dedicated constants file

## Meaningful Names

- Variables, functions, and classes should reveal their purpose
- Names should explain why something exists and how it's used
- Avoid abbreviations unless they're universally understood

## Smart Comments

- Don't comment on what the code does - make the code self-documenting
- Use comments to explain why something is done a certain way
- Document APIs, complex algorithms, and non-obvious side effects

## Single Responsibility

- Each function should do exactly one thing
- Functions should be small and focused
- If a function needs a comment to explain what it does, it should be split

## DRY (Don't Repeat Yourself)

- Extract repeated code into reusable functions
- Share common logic through proper abstraction
- Maintain single sources of truth

## Clean Structure

- Keep related code together
- Organize code in a logical hierarchy
- Use consistent file and folder naming conventions
- Prefer simplicity over complexity
- Prefer composition over inheritance

## Encapsulation

- Hide implementation details
- Expose clear interfaces
- Move nested conditionals into well-named functions
- Prefer immutable data structures
- Make state changes explicit and predictable

## Explicit Over Implicit

- Be explicit about intentions and behavior
- Avoid hidden side effects
- Make dependencies clear
- Prefer explicit returns over implicit ones
- Name things for what they are, not what you hope they'll be

## Error Handling

- Fail fast - catch errors early
- Handle errors at the appropriate level
- Provide meaningful error messages
- Never ignore or suppress errors silently
- Use proper error types and avoid generic catches

## Code Quality Maintenance

- Refactor continuously
- Fix technical debt early
- Leave code cleaner than you found it

## Performance

- Measure before optimizing
- Avoid premature optimization
- Focus on algorithmic improvements over micro-optimizations
- Cache expensive operations
- Be mindful of memory usage

## Security

- Never hardcode secrets or credentials
- Validate all inputs
- Sanitize outputs
- Don't log sensitive information
- Follow the principle of least privilege

## Testing

- Write tests before fixing bugs
- Keep tests readable and maintainable
- Test edge cases and error conditions

## Version Control

- Write clear commit messages
- Make small, focused commits
- Use meaningful branch names

## Code Reviews

- Focus on the code, not the person
- Suggest improvements, don't demand changes
- Explain the "why" behind feedback
- Be open to different approaches
- Prioritize critical issues over style preferences
