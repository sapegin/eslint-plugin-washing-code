# no-unnecessary-template-literal

Disallow template literals without interpolation.

## Rule Details

This rule flags template literals that don't contain any interpolation and could be replaced with regular strings.

Template literals are useful when you need to interpolate variables or create multi-line strings. However, using them for simple strings adds unnecessary syntax without any benefit.

Examples of **incorrect** code:

```js
const greeting = `hello`;
const name = `world`;
const message = ``;
```

Examples of **correct** code:

```js
const greeting = 'hello';
const name = 'world';
const message = `hello ${name}`;
const multiline = `hello
world`;
```

## When Not To Use It

If you prefer template literals for all strings regardless of interpolation, you can disable this rule.
