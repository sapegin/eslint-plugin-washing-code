import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import type { SourceCode } from '@typescript-eslint/utils/ts-eslint';

type ComparisonGroup = {
  variable: string;
  values: TSESTree.Expression[];
  nodes: TSESTree.BinaryExpression[];
};

function collectLogicalOrOperands(
  node: TSESTree.LogicalExpression
): TSESTree.Expression[] {
  const operands: TSESTree.Expression[] = [];

  function collect(expr: TSESTree.Expression) {
    if (expr.type === 'LogicalExpression' && expr.operator === '||') {
      collect(expr.left);
      collect(expr.right);
    } else {
      operands.push(expr);
    }
  }

  collect(node);
  return operands;
}

function groupEqualityComparisons(
  operands: TSESTree.Expression[],
  sourceCode: Readonly<SourceCode>
): Map<string, ComparisonGroup> {
  const groups = new Map<string, ComparisonGroup>();

  for (const operand of operands) {
    if (operand.type !== 'BinaryExpression' || operand.operator !== '===') {
      continue;
    }

    const { left, right } = operand;
    const variableText = sourceCode.getText(left);
    const value = right;

    if (groups.has(variableText) === false) {
      groups.set(variableText, {
        variable: variableText,
        values: [],
        nodes: [],
      });
    }

    const group = groups.get(variableText);
    if (group) {
      group.values.push(value);
      group.nodes.push(operand);
    }
  }

  return groups;
}

export const rule: ESLintUtils.RuleModule<'preferIncludes'> = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer .includes() over multiple equality comparisons with ||',
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferIncludes:
        'Use .includes() instead of multiple equality comparisons.',
    },
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      LogicalExpression(node: TSESTree.LogicalExpression) {
        if (node.operator !== '||') {
          return;
        }

        if (
          node.parent?.type === 'LogicalExpression' &&
          node.parent.operator === '||'
        ) {
          return;
        }

        const operands = collectLogicalOrOperands(node);
        const groups = groupEqualityComparisons(operands, sourceCode);

        for (const group of groups.values()) {
          if (group.values.length < 3) {
            continue;
          }

          if (operands.length !== group.nodes.length) {
            continue;
          }

          context.report({
            node,
            messageId: 'preferIncludes',
            fix(fixer) {
              const valuesText = group.values
                .map((value) => sourceCode.getText(value))
                .join(', ');
              const arrayLiteral = `[${valuesText}]`;
              const includesCall = `${arrayLiteral}.includes(${group.variable})`;

              const beforeNode = sourceCode.getTokenBefore(node);
              const afterNode = sourceCode.getTokenAfter(node);

              const hasExtraParens =
                beforeNode?.value === '(' &&
                afterNode?.value === ')' &&
                beforeNode.range[1] === node.range[0] &&
                afterNode.range[0] === node.range[1] &&
                node.parent?.type !== 'IfStatement' &&
                node.parent?.type !== 'WhileStatement' &&
                node.parent?.type !== 'ForStatement' &&
                node.parent?.type !== 'DoWhileStatement' &&
                node.parent?.type !== 'SwitchStatement';

              if (hasExtraParens) {
                const start = beforeNode.range[0];
                const end = afterNode.range[1];
                return fixer.replaceTextRange([start, end], includesCall);
              }

              return fixer.replaceText(node, includesCall);
            },
          });
        }
      },
    };
  },
};

export default rule;
