import type { Habit } from '../types/habit';

const HABITS_KEY = 'habit-tracker-habits';

export function getHabits(): Habit[] {
  if (typeof window === 'undefined') return [];
  const habits = localStorage.getItem(HABITS_KEY);
  return habits ? JSON.parse(habits) : [];
}

export function saveHabit(habit: Habit): void {
  const habits = getHabits();
  localStorage.setItem(HABITS_KEY, JSON.stringify([...habits, habit]));
}

export function updateHabit(updatedHabit: Habit): void {
  const habits = getHabits();
  const nextHabits = habits.map((h) => (h.id === updatedHabit.id ? updatedHabit : h));
  localStorage.setItem(HABITS_KEY, JSON.stringify(nextHabits));
}

export function deleteHabit(id: string): void {
  const habits = getHabits();
  const nextHabits = habits.filter((h) => h.id !== id);
  localStorage.setItem(HABITS_KEY, JSON.stringify(nextHabits));
}

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const isCompleted = habit.completions.includes(date);
  const nextCompletions = isCompleted
    ? habit.completions.filter((d) => d !== date)
    : Array.from(new Set([...habit.completions, date]));

  return {
    ...habit,
    completions: nextCompletions,
  };
}
