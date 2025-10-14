import { RuleTester } from '@typescript-eslint/rule-tester';
import path from 'node:path';
import { rule } from './explicit-boolean-check.js';

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

ruleTester.run('explicit-boolean-check', rule, {
  valid: [
    {
      code: 'const yep = true; if (yep === false) {}',
    },
    {
      code: 'const str = "hello"; if (str === "") {}',
    },
    {
      code: 'const num = 42; if (num === 0) {}',
    },
    {
      code: 'const val = null; if (val === null) {}',
    },
    {
      code: 'const val = undefined; if (val === undefined) {}',
    },
    {
      // I prefer Boolean(yep) but it's not a concern of this rule, so we keep
      // !! as is
      code: 'const yep = true; const nope = !!yep;',
      name: 'double negation is explicit coercion',
    },
    {
      code: 'const obj = { active: true }; if (obj.active === false) {}',
    },
    {
      code: 'const value: string | null = null; if (value === null) {}',
      name: 'optional type with null',
    },
    {
      code: 'const value: string | undefined = undefined; if (value === undefined) {}',
      name: 'optional type with undefined',
    },
  ],
  invalid: [
    {
      code: 'const yep = true; if (!yep) {}',
      errors: [
        {
          messageId: 'preferExplicitCheck',
          data: { comparison: '=== false' },
        },
      ],
      output: 'const yep = true; if (yep === false) {}',
    },
    {
      code: 'const str = "hello"; if (!str) {}',
      errors: [
        {
          messageId: 'preferExplicitCheck',
          data: { comparison: "=== ''" },
        },
      ],
      output: 'const str = "hello"; if (str === \'\') {}',
    },
    {
      code: 'const num = 42; if (!num) {}',
      errors: [
        {
          messageId: 'preferExplicitCheck',
          data: { comparison: '=== 0' },
        },
      ],
      output: 'const num = 42; if (num === 0) {}',
    },
    {
      code: 'const val = null; if (!val) {}',
      errors: [
        {
          messageId: 'preferExplicitCheck',
          data: { comparison: '=== null' },
        },
      ],
      output: 'const val = null; if (val === null) {}',
    },
    {
      code: 'const val = undefined; if (!val) {}',
      errors: [
        {
          messageId: 'preferExplicitCheck',
          data: { comparison: '=== undefined' },
        },
      ],
      output: 'const val = undefined; if (val === undefined) {}',
    },
    {
      code: 'const obj = { active: true }; if (!obj.active) {}',
      errors: [{ messageId: 'preferExplicitCheck' }],
      output: 'const obj = { active: true }; if (obj.active === false) {}',
    },
    {
      code: 'const flag = true; const result = !flag ? "yes" : "no";',
      errors: [{ messageId: 'preferExplicitCheck' }],
      output:
        'const flag = true; const result = flag === false ? "yes" : "no";',
    },
    {
      code: 'const a = 1, b = 2; if (!(a + b)) {}',
      errors: [{ messageId: 'preferExplicitCheck' }],
      output: 'const a = 1, b = 2; if ((a + b) === 0) {}',
      name: 'adds parentheses for binary expressions',
    },
    {
      code: 'const value: string | null = "hello"; if (!value) {}',
      errors: [
        {
          messageId: 'preferExplicitCheck',
          data: { comparison: '=== null' },
        },
      ],
      output: 'const value: string | null = "hello"; if (value === null) {}',
      name: 'optional type with null',
    },
    {
      code: 'const value: number | undefined = 42; if (!value) {}',
      errors: [
        {
          messageId: 'preferExplicitCheck',
          data: { comparison: '=== undefined' },
        },
      ],
      output:
        'const value: number | undefined = 42; if (value === undefined) {}',
      name: 'optional type with undefined',
    },
    {
      code: 'const value: string | null | undefined = "hello"; if (!value) {}',
      errors: [
        {
          messageId: 'preferExplicitCheck',
          data: { comparison: '== null' },
        },
      ],
      output:
        'const value: string | null | undefined = "hello"; if (value == null) {}',
      name: 'optional type with null and undefined',
    },
    {
      code: 'const value: string | number | null = "hello"; if (!value) {}',
      errors: [
        {
          messageId: 'preferExplicitCheck',
          data: { comparison: '=== null' },
        },
      ],
      output:
        'const value: string | number | null = "hello"; if (value === null) {}',
      name: 'multiple types with null',
    },
    {
      code: 'const value: string | boolean | undefined = "hello"; if (!value) {}',
      errors: [
        {
          messageId: 'preferExplicitCheck',
          data: { comparison: '=== undefined' },
        },
      ],
      output:
        'const value: string | boolean | undefined = "hello"; if (value === undefined) {}',
      name: 'multiple types with undefined',
    },
  ],
});

// Test without type information
const ruleTesterNoTypeInfo = new RuleTester();

ruleTesterNoTypeInfo.run('explicit-boolean-check (without type info)', rule, {
  valid: [
    {
      code: 'const yep = true; if (yep === false) {}',
    },
    {
      code: 'const yep = true; const nope = !!yep;',
      name: 'double negation is explicit coercion',
    },
  ],
  invalid: [
    {
      code: 'const yep = true; if (!yep) {}',
      errors: [{ messageId: 'preferExplicitCheckNoFix' }],
      output: null,
    },
    {
      code: 'const obj = { active: true }; if (!obj.active) {}',
      errors: [{ messageId: 'preferExplicitCheckNoFix' }],
      output: null,
    },
  ],
});
