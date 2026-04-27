import type { Habit } from '../types/habit';

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const isCompleted = habit.completions.includes(date);
  const nextCompletions = isCompleted
    ? habit.completions.filter((d) => d !== date)
    : [...habit.completions, date];

  return {
    ...habit,
    completions: nextCompletions,
  };
}
