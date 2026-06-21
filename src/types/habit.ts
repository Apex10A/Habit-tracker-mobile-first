export type HabitColor = 'pink' | 'purple' | 'green' | 'blue' | 'yellow' | 'accent';

export type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily';
  color: HabitColor;
  emoji: string;
  createdAt: string;
  completions: string[];
};
