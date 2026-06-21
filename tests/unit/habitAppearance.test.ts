import {
  DEFAULT_HABIT_COLOR,
  getDefaultHabitFields,
  getHabitColorOption,
  isHabitColor,
  normalizeHabit,
  sanitizeEmoji,
} from '../../src/lib/habitAppearance';

describe('sanitizeEmoji', () => {
  it('returns an empty string for blank input', () => {
    expect(sanitizeEmoji('   ')).toBe('');
  });

  it('returns the first emoji character', () => {
    expect(sanitizeEmoji('📚📖')).toBe('📚');
  });
});

describe('normalizeHabit', () => {
  it('fills in default color and emoji for legacy habits', () => {
    const habit = normalizeHabit({
      id: '1',
      userId: 'user-1',
      name: 'Drink Water',
      description: '',
      frequency: 'daily',
      createdAt: '2026-01-01',
      completions: ['2026-06-20'],
    });

    expect(habit.color).toBe(DEFAULT_HABIT_COLOR);
    expect(habit.emoji).toBe('');
  });

  it('preserves saved color and emoji values', () => {
    const habit = normalizeHabit({
      id: '1',
      userId: 'user-1',
      name: 'Read',
      description: '',
      frequency: 'daily',
      color: 'blue',
      emoji: '📚',
      createdAt: '2026-01-01',
      completions: [],
    });

    expect(habit.color).toBe('blue');
    expect(habit.emoji).toBe('📚');
  });
});

describe('getHabitColorOption', () => {
  it('returns matching color metadata', () => {
    expect(getHabitColorOption('pink').borderClass).toBe('border-l-pink');
  });

  it('falls back to accent for invalid values', () => {
    expect(getHabitColorOption('accent').id).toBe('accent');
  });
});

describe('getDefaultHabitFields', () => {
  it('returns accent color and no emoji', () => {
    expect(getDefaultHabitFields()).toEqual({
      color: DEFAULT_HABIT_COLOR,
      emoji: '',
    });
  });
});

describe('isHabitColor', () => {
  it('accepts valid preset colors only', () => {
    expect(isHabitColor('green')).toBe(true);
    expect(isHabitColor('orange')).toBe(false);
  });
});
