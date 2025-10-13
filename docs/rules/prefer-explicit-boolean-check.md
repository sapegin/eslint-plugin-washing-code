# prefer-explicit-boolean-check

✅ Recommended; 🔧 Autofixable

Require explicit comparison instead of negation operator.

## Rule Details

This rule enforces explicit comparisons instead of using the negation operator (`!`). Explicit comparisons make the intent clearer and are easier to understand, especially for developers less familiar with JavaScript's truthy/falsy behavior.

The rule uses TypeScript type information to determine the appropriate comparison:

- `boolean` → `=== false`
- `null` → `=== null`
- `undefined` → `=== undefined`
- `string` → `=== ''`
- `number` → `=== 0`

Examples of **incorrect** code:

```js
const yep = true;
if (!yep) {
}

const str = 'hello';
if (!str) {
}

const num = 42;
if (!num) {
}

const val = null;
if (!val) {
}

const obj = { active: true };
if (!obj.active) {
}
```

Examples of **correct** code:

```js
const yep = true;
if (yep === false) {
}

const str = 'hello';
if (str === '') {
}

const num = 42;
if (num === 0) {
}

const val = null;
if (val === null) {
}

const obj = { active: true };
if (obj.active === false) {
}

// Double negation is allowed (explicit coercion)
const truthy = !!value;
```

## Options

This rule has no options.

## When Not To Use It

If you prefer the concise negation operator and your team is comfortable with JavaScript's truthy/falsy behavior, you can disable this rule.

## Prerequisites

This rule works best with TypeScript type information, which enables automatic fixing with type-appropriate comparisons. When type information is available, the rule will suggest and auto-fix with the correct comparison operator.

**With type information** (recommended):

```js
export default {
  languageOptions: {
    parserOptions: {
      project: true
    }
  }
};
```

**Without type information**: The rule will still detect negation operators and warn about them, but won't provide automatic fixes since it cannot determine the appropriate comparison without knowing the type.
