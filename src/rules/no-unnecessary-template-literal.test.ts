import { RuleTester } from '@typescript-eslint/rule-tester';
import { rule } from './no-unnecessary-template-literal.js';

const ruleTester = new RuleTester();

ruleTester.run('no-unnecessary-template-literal', rule, {
  valid: [
    {
      code: 'const greeting = "hello";',
    },
    {
      code: "const greeting = 'hello';",
    },
    {
      code: 'const greeting = `hello ${name}`;',
    },
    {
      code: 'const greeting = `hello ${name} world`;',
    },
  ],
  invalid: [
    {
      code: 'const greeting = `hello`;',
      errors: [{ messageId: 'unnecessaryTemplate' }],
      output: "const greeting = 'hello';",
    },
    {
      code: 'const greeting = `world`;',
      errors: [{ messageId: 'unnecessaryTemplate' }],
      output: "const greeting = 'world';",
    },
    {
      code: "const greeting = `it's working`;",
      errors: [{ messageId: 'unnecessaryTemplate' }],
      output: String.raw`const greeting = 'it\'s working';`,
    },
    {
      code: 'const empty = ``;',
      errors: [{ messageId: 'unnecessaryTemplate' }],
      output: "const empty = '';",
    },
  ],
});
