'use client';

import { useState } from 'react';
import HabitCard from '@/components/habits/HabitCard';
import Card from '@/components/ui/Card';
import type { Habit } from '@/types/habit';
import { groupHabitsByTodayStatus } from '@/lib/today';
import { cn } from '@/lib/cn';

type TodayHabitsListProps = {
  habits: Habit[];
  onUpdate: () => void;
  onEdit: (habit: Habit) => void;
};

export default function TodayHabitsList({ habits, onUpdate, onEdit }: TodayHabitsListProps) {
  const { incomplete, complete } = groupHabitsByTodayStatus(habits);
  const [showCompleted, setShowCompleted] = useState(incomplete.length === 0);

  return (
    <div className="space-y-6" data-testid="today-habits-list">
      {incomplete.length > 0 && (
        <section data-testid="today-incomplete-section">
          <h3 className="font-display text-lg font-medium text-foreground mb-3">
            To do today
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {incomplete.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onUpdate={onUpdate}
                onEdit={() => onEdit(habit)}
              />
            ))}
          </div>
        </section>
      )}

      {complete.length > 0 && (
        <section data-testid="today-complete-section">
          <Card padding="none" className="overflow-hidden">
            <button
              type="button"
              onClick={() => setShowCompleted((open) => !open)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-background/60 transition-colors"
              data-testid="today-complete-toggle"
              aria-expanded={showCompleted}
            >
              <h3 className="font-display text-lg font-medium text-foreground">
                Done today
                <span className="ml-2 text-sm font-normal text-secondary-text">
                  ({complete.length})
                </span>
              </h3>
              <span
                className={cn(
                  'text-secondary-text transition-transform duration-200',
                  showCompleted && 'rotate-180'
                )}
                aria-hidden="true"
              >
                ▾
              </span>
            </button>

            {showCompleted && (
              <div className="grid gap-4 p-4 pt-0 md:grid-cols-2 border-t border-border-base">
                {complete.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onUpdate={onUpdate}
                    onEdit={() => onEdit(habit)}
                  />
                ))}
              </div>
            )}
          </Card>
        </section>
      )}

      {incomplete.length === 0 && complete.length === 0 && (
        <p className="text-center text-secondary-text py-4">No habits to show.</p>
      )}
    </div>
  );
}
