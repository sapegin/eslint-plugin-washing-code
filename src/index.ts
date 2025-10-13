import noUnnecessaryTemplateLiteral from './rules/no-unnecessary-template-literal.js';

const plugin = {
  meta: {
    name: 'eslint-plugin-washing-code',
    version: '1.0.0',
  },
  rules: {
    'no-unnecessary-template-literal': noUnnecessaryTemplateLiteral,
  },
};

export default plugin;
