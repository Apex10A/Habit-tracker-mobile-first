import type { Habit } from '../types/habit';
import { normalizeHabit } from './habitAppearance';

const HABITS_KEY = 'habit-tracker-habits';

export function getHabits(): Habit[] {
  if (typeof window === 'undefined') return [];
  const habits = localStorage.getItem(HABITS_KEY);
  if (!habits) return [];

  const parsed = JSON.parse(habits) as Record<string, unknown>[];
  return parsed.map((habit) => normalizeHabit(habit));
}

export function getUserHabits(userId: string): Habit[] {
  return getHabits().filter((habit) => habit.userId === userId);
}

export function replaceUserHabits(userId: string, habits: Habit[]): void {
  const otherHabits = getHabits().filter((habit) => habit.userId !== userId);
  localStorage.setItem(HABITS_KEY, JSON.stringify([...otherHabits, ...habits]));
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

export function getHabitById(id: string, userId: string): Habit | null {
  const habit = getHabits().find((entry) => entry.id === id && entry.userId === userId);
  return habit ?? null;
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
