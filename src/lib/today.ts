import type { Habit } from '@/types/habit';

export function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isCompletedOnDate(habit: Habit, date: string): boolean {
  return habit.completions.includes(date);
}

export type TodayProgress = {
  date: string;
  total: number;
  completed: number;
  percentage: number;
};

export function getTodayProgress(habits: Habit[], today = getLocalDateString()): TodayProgress {
  const total = habits.length;
  const completed = habits.filter((habit) => isCompletedOnDate(habit, today)).length;

  return {
    date: today,
    total,
    completed,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export type GroupedHabits = {
  incomplete: Habit[];
  complete: Habit[];
};

export function groupHabitsByTodayStatus(
  habits: Habit[],
  today = getLocalDateString()
): GroupedHabits {
  const incomplete: Habit[] = [];
  const complete: Habit[] = [];

  for (const habit of habits) {
    if (isCompletedOnDate(habit, today)) {
      complete.push(habit);
    } else {
      incomplete.push(habit);
    }
  }

  return { incomplete, complete };
}

export function formatTodayHeading(date = new Date()): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
