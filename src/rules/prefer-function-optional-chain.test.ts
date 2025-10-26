import { RuleTester } from '@typescript-eslint/rule-tester';
import { rule } from './prefer-function-optional-chain.js';

const ruleTester = new RuleTester();

ruleTester.run('prefer-function-optional-chain', rule, {
  valid: [
    {
      code: 'onError?.(error.message);',
      name: 'already using optional chaining',
    },
    {
      code: 'if (onError) { onError(error.message); doSomethingElse(); }',
      name: 'if block has multiple statements',
    },
    {
      code: 'if (onError) { onError(error.message); } else { handleDefault(); }',
      name: 'if has else clause',
    },
    {
      code: 'if (condition) { doSomething(); }',
      name: 'condition and function call are different',
    },
  ],
  invalid: [
    {
      code: 'if (onError) { onError(error.message); }',
      errors: [{ messageId: 'preferOptionalChain' }],
      output: 'onError?.(error.message);',
    },
    {
      code: 'if (callback) { callback(); }',
      errors: [{ messageId: 'preferOptionalChain' }],
      output: 'callback?.();',
    },
    {
      code: 'if (fn) { fn(a, b, c); }',
      errors: [{ messageId: 'preferOptionalChain' }],
      output: 'fn?.(a, b, c);',
    },
    {
      code: 'if (user.onError) { user.onError(msg); }',
      errors: [{ messageId: 'preferOptionalChain' }],
      output: 'user.onError?.(msg);',
    },
    {
      code: 'if (obj.nested.fn) { obj.nested.fn(x); }',
      errors: [{ messageId: 'preferOptionalChain' }],
      output: 'obj.nested.fn?.(x);',
    },
  ],
});
