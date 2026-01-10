import { describe, expect, it } from 'vitest';
import { buildSymbolPrompt } from '../geminiService';

describe('buildSymbolPrompt', () => {
  it('returns base prompt when no config provided', () => {
    const prompt = buildSymbolPrompt('Base prompt');
    expect(prompt).toBe('Base prompt');
  });

  it('includes influence and background instructions when configured', () => {
    const prompt = buildSymbolPrompt('Base prompt', {
      influence: 'western',
      transparentBackground: true
    });

    expect(prompt).toContain('WEIGHTING: Prioritize Western Zodiac geometry');
    expect(prompt).toContain('PURE WHITE or TRANSPARENT background');
  });
});
