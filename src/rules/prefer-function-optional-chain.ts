import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

function isSameName(
  test: TSESTree.Expression,
  callee: TSESTree.Expression
): boolean {
  if (test.type === 'Identifier' && callee.type === 'Identifier') {
    return test.name === callee.name;
  }

  if (test.type === 'MemberExpression' && callee.type === 'MemberExpression') {
    // Only handle non-private properties
    if (
      test.property.type === 'PrivateIdentifier' ||
      callee.property.type === 'PrivateIdentifier'
    ) {
      return false;
    }
    return (
      isSameName(test.object, callee.object) &&
      isSameName(test.property, callee.property)
    );
  }

  return false;
}

export const rule: ESLintUtils.RuleModule<'preferOptionalChain'> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer optional chaining over conditional function calls',
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferOptionalChain:
        'Use optional chaining (?.) instead of conditional check.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      IfStatement(node: TSESTree.IfStatement) {
        // Must have a consequent block with exactly one statement
        if (
          node.consequent.type !== 'BlockStatement' ||
          node.consequent.body.length !== 1
        ) {
          return;
        }

        // Must not have an else clause
        if (node.alternate) {
          return;
        }

        const statement = node.consequent.body[0];

        // The statement must be an expression statement
        if (statement.type !== 'ExpressionStatement') {
          return;
        }

        const expression = statement.expression;

        // The expression must be a call expression
        if (expression.type !== 'CallExpression') {
          return;
        }

        // The test must be a simple identifier or member expression
        const test = node.test;
        if (test.type !== 'Identifier' && test.type !== 'MemberExpression') {
          return;
        }

        // The callee must match the test
        if (isSameName(test, expression.callee) === false) {
          return;
        }

        context.report({
          node,
          messageId: 'preferOptionalChain',
          fix(fixer) {
            const sourceCode = context.sourceCode;
            const calleeText = sourceCode.getText(expression.callee);
            const argsText =
              expression.arguments.length > 0
                ? sourceCode.getText({
                    range: [
                      expression.arguments[0].range[0],
                      expression.arguments.at(-1)?.range[1]
                    ]
                  })
                : '';

            return fixer.replaceText(node, `${calleeText}?.(${argsText});`);
          },
        });
      },
    };
  },
};

export default rule;
