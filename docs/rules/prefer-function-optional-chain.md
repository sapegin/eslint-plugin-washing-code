# prefer-function-optional-chain

✅ Recommended; 🔧 Autofixable

Prefer optional chaining over conditional function calls.

When calling a function that might be `undefined`, using optional chaining (`?.()`) is more concise than checking if the function exists before calling it.

## Rule details

Examples of **incorrect** code:

```js
if (onError) {
  onError(error.message);
}

if (callback) {
  callback();
}

if (user.onError) {
  user.onError(msg);
}
```

Examples of **correct** code:

```js
onError?.(error.message);

callback?.();

user.onError?.(msg);

// Multiple statements in if block
if (onError) {
  onError(error.message);
  doSomethingElse();
}

// Has else clause
if (onError) {
  onError(error.message);
} else {
  handleDefault();
}

// Condition and function call are different
if (hasCookies) {
  eatCookies();
}
```

## Options

This rule has no options.

## When not to use it

If you prefer explicit conditional checks for function calls, you can disable this rule.
