import { expect, test } from 'vitest';
import { calculateMortgage } from './calculations';

test('Scenario 1: Basic Mortgage (£150k Loan, 3.5%, 25yr)', () => {
  const result = calculateMortgage(150000, 0, 25, 'fixed', 3.5);
  expect(result.monthlyPayment).toBe(750.99);
});

test('Scenario 5: Interest-Only Mortgage (£250k Loan, 4%, 25yr)', () => {
  const result = calculateMortgage(250000, 0, 25, 'interest-only', 4.0);
  expect(result.monthlyPayment).toBe(833.33);
});

test('Edge Case: Handle zero property price gracefully', () => {
  const result = calculateMortgage(0, 0, 25, 'fixed', 3.5);
  expect(result.monthlyPayment).toBe(0);
});