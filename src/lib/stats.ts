import type { Habit } from '@/types/habit';
import { parseLocalDate } from '@/lib/heatmap';
import { getLocalDateString } from '@/lib/today';

export type WeeklyStats = {
  completed: number;
  total: number;
  percentage: number;
  weekStart: string;
  weekEnd: string;
};

export function getWeekStart(today = getLocalDateString()): string {
  const date = parseLocalDate(today);
  date.setDate(date.getDate() - date.getDay());
  return getLocalDateString(date);
}

function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = parseLocalDate(start);
  const endDate = parseLocalDate(end);

  while (current <= endDate) {
    dates.push(getLocalDateString(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function getHabitWeeklyStats(habit: Habit, today = getLocalDateString()): WeeklyStats {
  const weekStart = getWeekStart(today);
  const dates = getDatesInRange(weekStart, today);
  const createdDate = getLocalDateString(new Date(habit.createdAt));
  const completionSet = new Set(habit.completions);

  let total = 0;
  let completed = 0;

  for (const date of dates) {
    if (date >= createdDate) {
      total++;
      if (completionSet.has(date)) {
        completed++;
      }
    }
  }

  return {
    completed,
    total,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    weekStart,
    weekEnd: today,
  };
}

export function getDashboardWeeklyStats(habits: Habit[], today = getLocalDateString()): WeeklyStats {
  const weekStart = getWeekStart(today);

  if (habits.length === 0) {
    return {
      completed: 0,
      total: 0,
      percentage: 0,
      weekStart,
      weekEnd: today,
    };
  }

  let completed = 0;
  let total = 0;

  for (const habit of habits) {
    const habitStats = getHabitWeeklyStats(habit, today);
    completed += habitStats.completed;
    total += habitStats.total;
  }

  return {
    completed,
    total,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    weekStart,
    weekEnd: today,
  };
}

export function formatWeekRange(weekStart: string, weekEnd: string): string {
  const startLabel = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(parseLocalDate(weekStart));
  const endLabel = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(parseLocalDate(weekEnd));

  return `${startLabel} – ${endLabel}`;
}
