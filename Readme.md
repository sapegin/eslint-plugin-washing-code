# eslint-plugin-washing-code

[![npm](https://img.shields.io/npm/v/eslint-plugin-washing-code.svg)](https://www.npmjs.com/package/eslint-plugin-washing-code) [![Node.js CI status](https://github.com/sapegin/eslint-plugin-washing-code/workflows/Node.js%20CI/badge.svg)](https://github.com/sapegin/eslint-plugin-washing-code/actions)

ESLint rules inspired by [Washing your code book](https://sapegin.me/book/).

[![Washing your code. A book on clean code for frontend developers](https://sapegin.me/images/washing-code-github.jpg)](https://sapegin.me/book/)

## Installation

```bash
npm install --save-dev eslint-plugin-washing-code
```

## Usage

Add `washing-code` to your ESLint configuration:

```js
import washingCode from 'eslint-plugin-washing-code';

export default [
  {
    plugins: {
      'washing-code': washingCode
    },
    rules: {
      'washing-code/no-unnecessary-template-literal': 'error'
    }
  }
];
```

## Rules

| Rule | Description | Fixable |
| --- | --- | --- |
| [no-unnecessary-template-literal](docs/rules/no-unnecessary-template-literal.md) | Disallow template literals without interpolation | ✅ |

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
