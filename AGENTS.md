# Agent Guidelines

This document contains guidelines and decisions for AI agents working on this ESLint plugin.

## Rule Development Principles

### Type Information Usage

**Rules should use full TypeScript type information when available.**

- Use `ESLintUtils.getParserServices(context, /* allowWithoutFullTypeInformation */ true)` to access parser services
- Check `services.program !== null` to determine if type information is available
- Leverage the TypeScript type checker to make informed decisions about fixes

### Graceful Degradation

**Rules should gracefully degrade when type information isn't available.**

- When type information is unavailable, rules should still detect issues but may skip auto-fixing
- Use separate message IDs for warnings with and without fixes (e.g., `preferExplicitCheck` vs `preferExplicitCheckNoFix`)
- Document the difference in behavior in the rule's documentation

Example:

```typescript
const services = ESLintUtils.getParserServices(
  context,
  /* allowWithoutFullTypeInformation */ true
);
const hasTypeInfo = services.program !== null;

if (!hasTypeInfo) {
  context.report({
    node,
    messageId: 'messageWithoutFix'
  });
  return;
}

// Type-aware logic with auto-fix
```

### Safety First

**Rules should be safe: autofix only when we're certain it won't change behavior.**

- Never auto-fix if there's ambiguity about the correct transformation
- Skip auto-fix for complex expressions or cases with potential side effects
- When in doubt, warn without fixing

### Testing Requirements

**All rules must have comprehensive test coverage:**

- Test valid cases (code that should not trigger the rule)
- Test invalid cases (code that should trigger the rule)
- Test edge cases (double negation, nested expressions, etc.)
- Test both with and without type information (when applicable)
- Verify auto-fix output matches expectations

### Documentation Standards

**Each rule must have complete documentation:**

- Clear description of what the rule enforces
- Examples of incorrect code
- Examples of correct code
- Configuration options (if any)
- Prerequisites (e.g., TypeScript project configuration)
- Behavior differences with/without type information
- Never use title case, always use sentence case

## Project Structure

- `src/rules/` - Rule implementations
- `src/rules/*.test.ts` - Rule tests (co-located with implementation)
- `src/rules/index.ts` - Barrel export that registers all rules with their names
- `docs/rules/` - Rule documentation
- `src/index.ts` - Plugin entry point (injects docs URLs and exports plugin)

## Testing Setup

Tests use Vitest with the `@typescript-eslint/rule-tester`:

- Setup file: `test/setup.ts` (configures RuleTester)
- Type information requires `projectService` configuration in test setup
- Tests run with `npm t` (includes lint, test, and format)

## Conventions

- Use TypeScript for all source files
- Follow existing code style (enforced by ESLint and Prettier)
- Export rules as default exports from individual rule files
- Register rules in `src/rules/index.ts` with their kebab-case names
- Documentation URLs are automatically generated in `src/index.ts` based on rule names
- Message IDs should be descriptive and use camelCase

## Adding a New Rule

1. Create rule file in `src/rules/your-rule-name.ts` and export as default
2. Create test file `src/rules/your-rule-name.test.ts`
3. Add rule to `src/rules/index.ts` with its kebab-case name
4. Create documentation in `docs/rules/your-rule-name.md`
5. The rule will be automatically available in the plugin with docs URL injected
