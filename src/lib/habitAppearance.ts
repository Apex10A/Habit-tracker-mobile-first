import type { Habit, HabitColor } from '@/types/habit';

export const DEFAULT_HABIT_COLOR: HabitColor = 'accent';

export const HABIT_COLOR_OPTIONS: {
  id: HabitColor;
  label: string;
  swatchClass: string;
  borderClass: string;
  tintClass: string;
}[] = [
  {
    id: 'pink',
    label: 'Pink',
    swatchClass: 'bg-pink',
    borderClass: 'border-l-pink',
    tintClass: 'bg-pink/35',
  },
  {
    id: 'purple',
    label: 'Purple',
    swatchClass: 'bg-purple',
    borderClass: 'border-l-purple',
    tintClass: 'bg-purple/50',
  },
  {
    id: 'green',
    label: 'Green',
    swatchClass: 'bg-green',
    borderClass: 'border-l-green',
    tintClass: 'bg-green/40',
  },
  {
    id: 'blue',
    label: 'Blue',
    swatchClass: 'bg-blue',
    borderClass: 'border-l-blue',
    tintClass: 'bg-blue/40',
  },
  {
    id: 'yellow',
    label: 'Yellow',
    swatchClass: 'bg-yellow',
    borderClass: 'border-l-yellow',
    tintClass: 'bg-yellow/45',
  },
  {
    id: 'accent',
    label: 'Lilac',
    swatchClass: 'bg-accent',
    borderClass: 'border-l-accent',
    tintClass: 'bg-accent-muted/70',
  },
];

export const HABIT_EMOJI_SUGGESTIONS = ['💧', '📚', '🏃', '🧘', '🥗', '💤', '✍️', '🎯'] as const;

const HABIT_COLOR_SET = new Set<HabitColor>(HABIT_COLOR_OPTIONS.map((option) => option.id));

export function isHabitColor(value: unknown): value is HabitColor {
  return typeof value === 'string' && HABIT_COLOR_SET.has(value as HabitColor);
}

export function sanitizeEmoji(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return [...trimmed][0] ?? '';
}

export function getHabitColorOption(color: HabitColor) {
  return HABIT_COLOR_OPTIONS.find((option) => option.id === color) ?? HABIT_COLOR_OPTIONS[5];
}

export function normalizeHabit(raw: Record<string, unknown>): Habit {
  return {
    id: String(raw.id),
    userId: String(raw.userId),
    name: String(raw.name),
    description: typeof raw.description === 'string' ? raw.description : '',
    frequency: 'daily',
    color: isHabitColor(raw.color) ? raw.color : DEFAULT_HABIT_COLOR,
    emoji: typeof raw.emoji === 'string' ? sanitizeEmoji(raw.emoji) : '',
    createdAt: String(raw.createdAt),
    completions: Array.isArray(raw.completions)
      ? raw.completions.filter((date): date is string => typeof date === 'string')
      : [],
  };
}

export function getDefaultHabitFields(): Pick<Habit, 'color' | 'emoji'> {
  return {
    color: DEFAULT_HABIT_COLOR,
    emoji: '',
  };
}
