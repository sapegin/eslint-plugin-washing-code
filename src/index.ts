import type { ESLint, Linter } from 'eslint';
import { rules as rawRules } from './rules/index.js';

const baseUrl =
  'https://github.com/sapegin/eslint-plugin-washing-code/blob/main/docs/rules';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rules: Record<string, any> = Object.fromEntries(
  Object.entries(rawRules).map(([name, rule]) => {
    const ruleWithUrl = {
      ...rule,
      meta: {
        ...rule.meta,
        docs: {
          ...rule.meta.docs,
          url: `${baseUrl}/${name}.md`,
        },
      },
    };
    return [name, ruleWithUrl];
  })
);

const plugin = {
  meta: {
    name: 'eslint-plugin-washing-code',
    version: '1.0.0',
  },
  rules,
  configs: {
    recommended: {
      plugins: {
        'washing-code': {} as ESLint.Plugin,
      },
      rules: {
        'washing-code/prefer-explicit-boolean-check': 'error',
      },
    },
  },
} satisfies ESLint.Plugin & {
  configs: {
    recommended: Linter.Config;
  };
};

plugin.configs.recommended.plugins['washing-code'] = plugin;

export default plugin;
