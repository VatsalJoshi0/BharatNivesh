import { describe, it, expect } from 'vitest';
import { calculateXIRR } from './xirr.js';

describe('calculateXIRR', () => {
  it('should return 0 for insufficient cashflows', () => {
    expect(calculateXIRR([])).toBe(0);
    expect(calculateXIRR([{ amount: -100, date: new Date() }])).toBe(0);
  });

  it('should return 0 if cashflows are only positive or only negative', () => {
    expect(calculateXIRR([
      { amount: -100, date: new Date('2026-01-01') },
      { amount: -200, date: new Date('2026-02-01') }
    ])).toBe(0);
  });

  it('should calculate XIRR correctly for a basic 1-year investment', () => {
    const cashFlows = [
      { amount: -1000, date: new Date('2025-01-01') },
      { amount: 1100, date: new Date('2026-01-01') }
    ];
    const xirr = calculateXIRR(cashFlows);
    expect(xirr).toBeCloseTo(10, 1);
  });
});
