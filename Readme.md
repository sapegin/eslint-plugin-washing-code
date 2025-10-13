# eslint-plugin-washing-code

[![npm](https://img.shields.io/npm/v/eslint-plugin-washing-code.svg)](https://www.npmjs.com/package/eslint-plugin-washing-code) [![Node.js CI status](https://github.com/sapegin/eslint-plugin-washing-code/workflows/Node.js%20CI/badge.svg)](https://github.com/sapegin/eslint-plugin-washing-code/actions)

ESLint rules inspired by [Washing your code book](https://sapegin.me/book/).

**Warning: this rule is highly experimental, use at your own risk!**

[![Washing your code. A book on clean code for frontend developers](https://sapegin.me/images/washing-code-github.jpg)](https://sapegin.me/book/)

## Installation

```bash
npm install --save-dev eslint-plugin-washing-code
```

## Usage

Use the recommended configuration:

```js
import washingCode from 'eslint-plugin-washing-code';

export default [washingCode.configs.recommended];
```

Or configure individual rules:

```js
import washingCode from 'eslint-plugin-washing-code';

export default [
  {
    plugins: {
      'washing-code': washingCode
    },
    rules: {
      'washing-code/prefer-explicit-boolean-check': 'error'
    }
  }
];
```

## Rules

✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Rule | Description | ✅ | 🔧 |
| --- | --- | --- | --- |
| [prefer-explicit-boolean-check](docs/rules/prefer-explicit-boolean-check.md) | Require explicit comparison instead of negation operator | ✅ | 🔧 |

## Motivation

TODO

## Sources

TODO

## Sponsoring

This software has been developed with lots of coffee, buy me one more cup to keep it going.

<a href="https://www.buymeacoffee.com/sapegin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" height="51" width="217"></a>

## Contributing

Bug fixes are welcome, but not new features. Please take a moment to review the [contributing guidelines](Contributing.md).

## Authors and license

[Artem Sapegin](https://sapegin.me) and [contributors](https://github.com/sapegin/eslint-plugin-washing-code/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
