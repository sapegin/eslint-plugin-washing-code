import noUnnecessaryTemplateLiteral from './rules/no-unnecessary-template-literal.js';
import preferExplicitBooleanCheck from './rules/prefer-explicit-boolean-check.js';

const plugin = {
  meta: {
    name: 'eslint-plugin-washing-code',
    version: '1.0.0',
  },
  rules: {
    'no-unnecessary-template-literal': noUnnecessaryTemplateLiteral,
    'prefer-explicit-boolean-check': preferExplicitBooleanCheck,
  },
};

export default plugin;
