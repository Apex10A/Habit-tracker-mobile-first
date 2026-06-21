'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import { toggleHabitCompletion, updateHabit, deleteHabit } from '@/lib/habits';
import { IconEdit, IconTrash } from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface HabitCardProps {
  habit: Habit;
  onUpdate: () => void;
  onEdit: () => void;
}

export default function HabitCard({ habit, onUpdate, onEdit }: HabitCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions);

  const handleToggle = () => {
    const updatedHabit = toggleHabitCompletion(habit, today);
    updateHabit(updatedHabit);
    onUpdate();
  };

  const handleConfirmDelete = () => {
    deleteHabit(habit.id);
    onUpdate();
    setIsDeleting(false);
  };

  if (isDeleting) {
    return (
      <div
        data-testid={`habit-card-${slug}`}
        className="p-4 border border-danger/30 bg-danger-muted rounded-2xl shadow-sm flex flex-col gap-4"
      >
        <p className="text-danger font-medium text-center">Delete this habit?</p>
        <div className="flex gap-2">
          <Button variant="secondary" fullWidth onClick={() => setIsDeleting(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={handleConfirmDelete}
            data-testid="confirm-delete-button"
          >
            Delete
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={cn(
        'p-4 border rounded-2xl shadow-sm transition-all',
        isCompletedToday
          ? 'bg-success-muted/50 border-success/40'
          : 'bg-background border-border-base'
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className={cn(
              'font-display text-lg font-bold',
              isCompletedToday ? 'text-success line-through' : 'text-foreground'
            )}
          >
            {habit.name}
          </h3>
          <p className="text-sm text-secondary-text">{habit.description}</p>
        </div>
        <div className="flex flex-col items-end">
          <span
            data-testid={`habit-streak-${slug}`}
            className="text-2xl font-bold text-streak"
          >
            {streak}🔥
          </span>
          <span className="text-xs text-secondary-text uppercase tracking-wide">Streak</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleToggle}
          data-testid={`habit-complete-${slug}`}
          variant={isCompletedToday ? 'success' : 'primary'}
          fullWidth
        >
          {isCompletedToday ? 'Completed' : 'Complete Today'}
        </Button>
        <Button
          onClick={onEdit}
          data-testid={`habit-edit-${slug}`}
          variant="ghost"
          size="icon"
          title="Edit Habit"
        >
          <IconEdit />
        </Button>
        <Button
          onClick={() => setIsDeleting(true)}
          data-testid={`habit-delete-${slug}`}
          variant="ghost"
          size="icon"
          className="text-danger hover:bg-danger-muted"
          title="Delete Habit"
        >
          <IconTrash />
        </Button>
      </div>
    </div>
  );
}
