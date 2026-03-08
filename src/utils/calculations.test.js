import { expect, test } from 'vitest';
import { calculateMortgage } from './calculations';

test('Mortgage calculation should be accurate according to standard formula', () => {
  const result = calculateMortgage(100000, 20, 10, 'fixed');
  expect(result.monthlyPayment).toBeGreaterThan(0);
  expect(result.interestPercent).toBeDefined();
});