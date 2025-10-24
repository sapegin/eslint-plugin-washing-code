import { RuleTester } from '@typescript-eslint/rule-tester';
import path from 'node:path';
import { rule } from './prefer-includes-conditions.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ['*.ts'],
        defaultProject: path.resolve(
          import.meta.dirname,
          '../../tsconfig.json'
        ),
      },
      tsconfigRootDir: path.resolve(import.meta.dirname, '../..'),
    },
  },
});

ruleTester.run('prefer-includes-conditions', rule, {
  valid: [
    {
      code: "if (['1', '2', '3'].includes(size)) {}",
      name: 'already using includes',
    },
    {
      code: "if (size === '1' || size === '2') {}",
      name: 'only two comparisons',
    },
    {
      code: "if (size === '1') {}",
      name: 'single comparison',
    },
    {
      code: "if (size === '1' && size === '2' && size === '3') {}",
      name: 'using && operator',
    },
    {
      code: "if (size === '1' || name === '2' || age === '3') {}",
      name: 'different variables',
    },
    {
      code: "if (size === '1' || size === '2' || name === '3') {}",
      name: 'mixed variables with only 2 same',
    },
    {
      code: "if (size == '1' || size == '2' || size == '3') {}",
      name: 'using loose equality',
    },
    {
      code: "if (size !== '1' || size !== '2' || size !== '3') {}",
      name: 'using !== operator',
    },
  ],
  invalid: [
    {
      code: "if (size === '1' || size === '2' || size === '3') {}",
      errors: [{ messageId: 'preferIncludes' }],
      output: "if (['1', '2', '3'].includes(size)) {}",
      name: 'basic if statement',
    },
    {
      code: "(size === '1' || size === '2' || size === '3') ? 'yep' : 'nope'",
      errors: [{ messageId: 'preferIncludes' }],
      output: "['1', '2', '3'].includes(size) ? 'yep' : 'nope'",
      name: 'ternary operator',
    },
    {
      code: "(size === '1' || size === '2' || size === '3') && 'yep'",
      errors: [{ messageId: 'preferIncludes' }],
      output: "['1', '2', '3'].includes(size) && 'yep'",
      name: 'logical AND',
    },
    {
      code: "const result = size === '1' || size === '2' || size === '3';",
      errors: [{ messageId: 'preferIncludes' }],
      output: "const result = ['1', '2', '3'].includes(size);",
      name: 'variable assignment',
    },
    {
      code: "if (status === 'active' || status === 'pending' || status === 'approved') {}",
      errors: [{ messageId: 'preferIncludes' }],
      output: "if (['active', 'pending', 'approved'].includes(status)) {}",
      name: 'longer strings',
    },
    {
      code: 'if (num === 1 || num === 2 || num === 3) {}',
      errors: [{ messageId: 'preferIncludes' }],
      output: 'if ([1, 2, 3].includes(num)) {}',
      name: 'numeric values',
    },
    {
      code: "if (size === '1' || size === '2' || size === '3' || size === '4') {}",
      errors: [{ messageId: 'preferIncludes' }],
      output: "if (['1', '2', '3', '4'].includes(size)) {}",
      name: 'four comparisons',
    },
    {
      code: "if (obj.prop === 'a' || obj.prop === 'b' || obj.prop === 'c') {}",
      errors: [{ messageId: 'preferIncludes' }],
      output: "if (['a', 'b', 'c'].includes(obj.prop)) {}",
      name: 'property access',
    },
    {
      code: "if (arr[0] === 'x' || arr[0] === 'y' || arr[0] === 'z') {}",
      errors: [{ messageId: 'preferIncludes' }],
      output: "if (['x', 'y', 'z'].includes(arr[0])) {}",
      name: 'array element access',
    },
  ],
});
