import { calculateBestStreak, calculateCurrentStreak } from '../../src/lib/streaks';

describe('calculateCurrentStreak', () => {
  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([], '2026-04-27')).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    expect(calculateCurrentStreak(['2026-04-26'], '2026-04-27')).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
    const completions = ['2026-04-27', '2026-04-26', '2026-04-25'];
    expect(calculateCurrentStreak(completions, '2026-04-27')).toBe(3);
  });

  it('ignores duplicate completion dates', () => {
    const completions = ['2026-04-27', '2026-04-27', '2026-04-26'];
    expect(calculateCurrentStreak(completions, '2026-04-27')).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    const completions = ['2026-04-27', '2026-04-25', '2026-04-24'];
    expect(calculateCurrentStreak(completions, '2026-04-27')).toBe(1);
  });
});

describe('calculateBestStreak', () => {
  it('returns the longest historical streak', () => {
    const completions = ['2026-04-20', '2026-04-21', '2026-04-22', '2026-04-24'];
    expect(calculateBestStreak(completions)).toBe(3);
  });
});
