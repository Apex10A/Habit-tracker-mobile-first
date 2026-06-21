import {
  formatTodayHeading,
  getLocalDateString,
  getTodayProgress,
  groupHabitsByTodayStatus,
  isCompletedOnDate,
} from '../../src/lib/today';
import type { Habit } from '../../src/types/habit';

const makeHabit = (id: string, completions: string[] = []): Habit => ({
  id,
  userId: 'user-1',
  name: `Habit ${id}`,
  description: '',
  frequency: 'daily',
  createdAt: '2026-06-20T00:00:00.000Z',
  completions,
});

describe('getLocalDateString', () => {
  it('returns a YYYY-MM-DD string in local time', () => {
    const date = new Date(2026, 5, 20, 15, 30);
    expect(getLocalDateString(date)).toBe('2026-06-20');
  });
});

describe('getTodayProgress', () => {
  it('returns zero progress when there are no habits', () => {
    expect(getTodayProgress([], '2026-06-20')).toEqual({
      date: '2026-06-20',
      total: 0,
      completed: 0,
      percentage: 0,
    });
  });

  it('counts completed habits for the given day', () => {
    const habits = [
      makeHabit('1', ['2026-06-20']),
      makeHabit('2', ['2026-06-19']),
      makeHabit('3', ['2026-06-20']),
    ];

    expect(getTodayProgress(habits, '2026-06-20')).toEqual({
      date: '2026-06-20',
      total: 3,
      completed: 2,
      percentage: 67,
    });
  });
});

describe('groupHabitsByTodayStatus', () => {
  it('splits habits into incomplete and complete lists', () => {
    const habits = [
      makeHabit('1', ['2026-06-20']),
      makeHabit('2'),
      makeHabit('3', ['2026-06-20']),
    ];

    expect(groupHabitsByTodayStatus(habits, '2026-06-20')).toEqual({
      incomplete: [habits[1]],
      complete: [habits[0], habits[2]],
    });
  });
});

describe('isCompletedOnDate', () => {
  it('returns true when the habit was completed on the date', () => {
    const habit = makeHabit('1', ['2026-06-20']);
    expect(isCompletedOnDate(habit, '2026-06-20')).toBe(true);
    expect(isCompletedOnDate(habit, '2026-06-19')).toBe(false);
  });
});

describe('formatTodayHeading', () => {
  it('returns a human-readable date heading', () => {
    const heading = formatTodayHeading(new Date(2026, 5, 20));
    expect(heading).toMatch(/June/);
    expect(heading).toMatch(/20/);
  });
});
