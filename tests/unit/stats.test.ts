import type { Habit } from '../../src/types/habit';
import {
  formatWeekRange,
  getDashboardWeeklyStats,
  getHabitWeeklyStats,
  getWeekStart,
} from '../../src/lib/stats';

const makeHabit = (overrides: Partial<Habit> = {}): Habit => ({
  id: 'habit-1',
  userId: 'user-1',
  name: 'Read',
  description: '',
  frequency: 'daily',
  color: 'blue',
  emoji: '📚',
  createdAt: '2026-06-01T00:00:00.000Z',
  completions: [],
  ...overrides,
});

describe('getWeekStart', () => {
  it('returns the Sunday before the given date', () => {
    expect(getWeekStart('2026-06-20')).toBe('2026-06-14');
  });
});

describe('getHabitWeeklyStats', () => {
  it('counts only trackable days since the habit was created', () => {
    const habit = makeHabit({
      createdAt: '2026-06-18T00:00:00.000Z',
      completions: ['2026-06-18', '2026-06-19', '2026-06-20'],
    });

    expect(getHabitWeeklyStats(habit, '2026-06-20')).toEqual({
      completed: 3,
      total: 3,
      percentage: 100,
      weekStart: '2026-06-14',
      weekEnd: '2026-06-20',
    });
  });

  it('returns zero when no days are due yet this week', () => {
    const habit = makeHabit({
      createdAt: '2026-06-21T00:00:00.000Z',
    });

    expect(getHabitWeeklyStats(habit, '2026-06-20')).toEqual({
      completed: 0,
      total: 0,
      percentage: 0,
      weekStart: '2026-06-14',
      weekEnd: '2026-06-20',
    });
  });
});

describe('getDashboardWeeklyStats', () => {
  it('aggregates weekly completion across all habits', () => {
    const habits = [
      makeHabit({
        id: '1',
        completions: ['2026-06-19', '2026-06-20'],
      }),
      makeHabit({
        id: '2',
        completions: ['2026-06-20'],
      }),
    ];

    expect(getDashboardWeeklyStats(habits, '2026-06-20')).toEqual({
      completed: 3,
      total: 14,
      percentage: 21,
      weekStart: '2026-06-14',
      weekEnd: '2026-06-20',
    });
  });
});

describe('formatWeekRange', () => {
  it('returns a readable date range', () => {
    expect(formatWeekRange('2026-06-14', '2026-06-20')).toMatch(/Jun/);
  });
});
