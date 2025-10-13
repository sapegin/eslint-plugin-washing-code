import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

export const rule: ESLintUtils.RuleModule<'unnecessaryTemplate'> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow template literals without interpolation',
    },
    fixable: 'code',
    schema: [],
    messages: {
      unnecessaryTemplate:
        'Unnecessary template literal. Use a regular string instead.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      TemplateLiteral(node: TSESTree.TemplateLiteral) {
        if (node.expressions.length === 0 && node.quasis.length === 1) {
          const { quasis } = node;
          const text = quasis[0].value.cooked ?? quasis[0].value.raw;

          if (text.includes('\n') || text.includes('\r')) {
            return;
          }

          context.report({
            node,
            messageId: 'unnecessaryTemplate',
            fix(fixer) {
              const quote = "'";
              const escaped = text.replaceAll("'", String.raw`\'`);
              return fixer.replaceText(node, `${quote}${escaped}${quote}`);
            },
          });
        }
      },
    };
  },
};
