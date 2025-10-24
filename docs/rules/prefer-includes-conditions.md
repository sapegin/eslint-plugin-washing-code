# prefer-includes-conditions

✅ Recommended; 🔧 Autofixable

Prefer `.includes()` over multiple equality comparisons with `||`.

When checking if a variable matches one of several values, using `.includes()` is more concise and easier to read than chaining multiple equality comparisons with the `||` operator.

This rule only applies when:

- The same variable is compared to at least 3 different values
- All comparisons use strict equality (`===`)

## Rule Details

Examples of **incorrect** code:

```js
if (size === '1' || size === '2' || size === '3') {
}

if (num === 1 || num === 2 || num === 3) {
}

const result =
  size === '1' || size === '2' || size === '3' ? 'yep' : 'nope';

(size === '1' || size === '2' || size === '3') && doSomething();
```

Examples of **correct** code:

```js
if (['1', '2', '3'].includes(size)) {
}

if ([1, 2, 3].includes(num)) {
}

const result = ['1', '2', '3'].includes(size) ? 'yep' : 'nope';

['1', '2', '3'].includes(size) && doSomething();

// Only 2 comparisons - threshold not met
if (size === '1' || size === '2') {
}

// Different variables
if (size === '1' || name === '2' || age === '3') {
}

// Using loose equality (not supported)
if (size == '1' || size == '2' || size == '3') {
}
```

## Options

This rule has no options.

## When not to use it

If you prefer the explicit nature of multiple equality comparisons, you can disable this rule.
