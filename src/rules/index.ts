import { rule as preferExplicitBooleanCheckRule } from './explicit-boolean-check.js';
import { rule as preferIncludesConditionsRule } from './prefer-includes-conditions.js';

export const rules = {
  'explicit-boolean-check': preferExplicitBooleanCheckRule,
  'prefer-includes-conditions': preferIncludesConditionsRule,
};
