import { describe, it, expect } from 'vitest';
import { analyzeSentiment } from '../src/services/aiService.js';

describe('analyzeSentiment', () => {
  it('should accurately classify bullish financial terms', async () => {
    const results = await analyzeSentiment(["Company reports record high profit growth"]);
    expect(results[0].sentiment).toBe('Bullish');
    expect(results[0].tone).toBe('positive');
  }, 60000);

  it('should accurately classify bearish financial terms', async () => {
    const results = await analyzeSentiment(["Earnings slump leads to sharp stock drop"]);
    expect(results[0].sentiment).toBe('Bearish');
    expect(results[0].tone).toBe('negative');
  }, 60000);
});
