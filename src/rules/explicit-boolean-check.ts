import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import * as ts from 'typescript';

function getExplicitComparison(type: ts.Type): string | null {
  // Handle union types
  if (type.isUnion()) {
    let hasNull = false;
    let hasUndefined = false;
    let hasOtherTypes = false;
    const comparisons = new Set<string>();

    for (const subType of type.types) {
      if (subType.flags & ts.TypeFlags.Null) {
        hasNull = true;
      } else if (subType.flags & ts.TypeFlags.Undefined) {
        hasUndefined = true;
      } else {
        hasOtherTypes = true;
        const comparison = getSingleTypeComparison(subType);
        if (comparison) {
          comparisons.add(comparison);
        }
      }
    }

    // If union contains null/undefined, prioritize checking for them,
    // regardless of how many other types are in the union
    if (hasNull && hasOtherTypes && hasUndefined === false) {
      return '=== null';
    }
    if (hasUndefined && hasOtherTypes && hasNull === false) {
      return '=== undefined';
    }
    if (hasNull && hasUndefined && hasOtherTypes) {
      return '== null';
    }

    // Only auto-fix if all union members have the same comparison
    // TODO: What the fuck is "have the same comparison"?!
    if (comparisons.size === 1) {
      return Array.from(comparisons)[0];
    }

    return null;
  }

  return getSingleTypeComparison(type);
}

function getSingleTypeComparison(type: ts.Type): string | null {
  // Boolean type
  if (
    type.flags & ts.TypeFlags.Boolean ||
    type.flags & ts.TypeFlags.BooleanLiteral
  ) {
    return '=== false';
  }

  // Null
  if (type.flags & ts.TypeFlags.Null) {
    return '=== null';
  }

  // Undefined
  if (type.flags & ts.TypeFlags.Undefined) {
    return '=== undefined';
  }

  // String
  if (
    type.flags & ts.TypeFlags.String ||
    type.flags & ts.TypeFlags.StringLiteral
  ) {
    return "=== ''";
  }

  // Number
  if (
    type.flags & ts.TypeFlags.Number ||
    type.flags & ts.TypeFlags.NumberLiteral
  ) {
    return '=== 0';
  }

  // No safe comparison for other types
  return null;
}

function needsParentheses(node: TSESTree.Expression): boolean {
  // Binary expressions and other low-precedence operators need parentheses
  return (
    node.type === 'BinaryExpression' ||
    node.type === 'LogicalExpression' ||
    node.type === 'ConditionalExpression' ||
    node.type === 'AssignmentExpression' ||
    node.type === 'SequenceExpression'
  );
}

export const rule: ESLintUtils.RuleModule<
  'preferExplicitCheck' | 'preferExplicitCheckNoFix'
> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require explicit comparison instead of negation operator',
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferExplicitCheck:
        'Use explicit comparison ({{ comparison }}) instead of negation operator.',
      preferExplicitCheckNoFix:
        'Prefer explicit comparison instead of negation operator.',
    },
  },
  defaultOptions: [],
  create(context) {
    let services;
    try {
      services = ESLintUtils.getParserServices(
        context,
        /* allowWithoutFullTypeInformation */ true
      );
    } catch {
      // Parser services not available, run without type information
      services = null;
    }

    const hasTypeInfo = services?.program != null;
    const checker =
      hasTypeInfo && services && services.program
        ? services.program.getTypeChecker()
        : null;

    return {
      UnaryExpression(node: TSESTree.UnaryExpression) {
        if (node.operator !== '!' || node.prefix === false) {
          return;
        }

        // Skip double negation (!!x) - it's explicit coercion
        if (
          node.parent?.type === 'UnaryExpression' &&
          node.parent.operator === '!'
        ) {
          return;
        }

        // Skip if this is the inner negation of a double negation
        if (
          node.argument.type === 'UnaryExpression' &&
          node.argument.operator === '!'
        ) {
          return;
        }

        // Without type info, just warn without autofix
        if (hasTypeInfo === false || checker === null || services === null) {
          context.report({
            node,
            messageId: 'preferExplicitCheckNoFix',
          });
          return;
        }

        const tsNode = services.esTreeNodeToTSNodeMap.get(node.argument);
        // TypeScript knows checker is not null here due to the guard above
        let type = checker.getTypeAtLocation(tsNode);

        // For identifiers, try to get the declared type from the symbol
        // This handles cases like `const value: string | null = "hello"`
        if (ts.isIdentifier(tsNode)) {
          const symbol = checker.getSymbolAtLocation(tsNode);
          if (symbol && symbol.valueDeclaration) {
            const declaredType = checker.getTypeOfSymbolAtLocation(
              symbol,
              symbol.valueDeclaration
            );
            if (declaredType) {
              type = declaredType;
            }
          }
        }

        const comparison = getExplicitComparison(type);

        if (comparison === null) {
          return;
        }

        context.report({
          node,
          messageId: 'preferExplicitCheck',
          data: {
            comparison,
          },
          fix(fixer) {
            const sourceCode = context.sourceCode;
            const argumentText = sourceCode.getText(node.argument);
            const needsParens = needsParentheses(node.argument);

            const operand = needsParens ? `(${argumentText})` : argumentText;

            return fixer.replaceText(node, `${operand} ${comparison}`);
          },
        });
      },
    };
  },
};
