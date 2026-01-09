import { describe, expect, it } from 'vitest';
import { runFusionAnalysis } from '../astroPhysics';

describe('runFusionAnalysis', () => {
  it('returns a fusion result with expected western sign data', async () => {
    const result = await runFusionAnalysis({
      date: '1990-01-15',
      time: '12:00',
      location: 'Berlin'
    });

    expect(result.western.sunSign).toBe('Capricorn');
    expect(result.prompt).toContain('Western Sun: Capricorn');
    expect(result.synthesisTitle.length).toBeGreaterThan(0);
    expect(result.synthesisDescription.length).toBeGreaterThan(0);
  });
});
