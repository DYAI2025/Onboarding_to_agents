import { describe, expect, it } from 'vitest';
import { fetchTransitsForDate } from '../transitService';

describe('fetchTransitsForDate', () => {
  it('returns a full set of transits for a date', async () => {
    const transits = await fetchTransitsForDate(new Date('2024-06-01T00:00:00Z'));

    expect(transits).toHaveLength(10);
    for (const transit of transits) {
      expect(transit.body).toBeTruthy();
      expect(transit.sign).toBeTruthy();
      expect(Number.isFinite(transit.degree)).toBe(true);
    }
  });

  it('handles invalid dates by falling back to current date', async () => {
    const transits = await fetchTransitsForDate(new Date('invalid'));
    expect(transits.length).toBeGreaterThan(0);
  });
});
