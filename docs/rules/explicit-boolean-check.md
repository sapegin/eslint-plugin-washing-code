# explicit-boolean-check

✅ Recommended; 🔧 Autofixable

Require explicit comparison instead of negation operator.

TODO: Find the book chapter where I talk about it

## Rule Details

This rule enforces explicit comparisons instead of using the negation operator (`!`). Explicit comparisons make the intent clearer and are easier to understand, especially for developers less familiar with JavaScript’s truthy/falsy behavior.

The rule uses TypeScript type information (when available) to determine the appropriate comparison:

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

## When not to use it

If you prefer the concise negation operator (`!`) and your team is comfortable with JavaScript’s truthy/falsy behavior, you can disable this rule.
