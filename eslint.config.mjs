import tamiaTypeScript from 'eslint-config-tamia/typescript';
import washingCode from './out/index.js';

const config = [
  ...tamiaTypeScript,
  washingCode.configs.recommended,
  {
    rules: {
      'washing-code/no-unnecessary-template-literal': 'off',
    },
  },
  {
    ignores: ['out/'],
  },
];

export default config;
