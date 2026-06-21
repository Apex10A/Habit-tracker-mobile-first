'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import { getLocalDateString } from '@/lib/today';
import { getHabitColorOption } from '@/lib/habitAppearance';
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
  const today = getLocalDateString();
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);
  const colorOption = getHabitColorOption(habit.color);

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
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleToggle();
        }
      }}
      aria-pressed={isCompletedToday}
      aria-label={`${habit.name}, ${isCompletedToday ? 'completed today' : 'not completed today'}. Tap to toggle.`}
      className={cn(
        'p-4 border border-border-base border-l-4 rounded-2xl shadow-sm transition-all cursor-pointer select-none',
        colorOption.borderClass,
        'hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        isCompletedToday
          ? 'bg-success-muted/50'
          : 'bg-background hover:border-accent/40'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          data-testid={`habit-complete-${slug}`}
          className={cn(
            'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
            isCompletedToday
              ? 'border-success bg-success text-on-accent'
              : 'border-border-strong bg-surface'
          )}
          aria-hidden="true"
        >
          {isCompletedToday && (
            <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none">
              <path
                d="M2.5 6l2.5 2.5 4.5-5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                {habit.emoji ? (
                  <span
                    data-testid={`habit-emoji-display-${slug}`}
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-lg',
                      colorOption.tintClass
                    )}
                    aria-hidden="true"
                  >
                    {habit.emoji}
                  </span>
                ) : null}
                <h3
                  className={cn(
                    'font-display text-lg font-bold truncate',
                    isCompletedToday ? 'text-success line-through' : 'text-foreground'
                  )}
                >
                  {habit.name}
                </h3>
              </div>
              {habit.description ? (
                <p className="text-sm text-secondary-text line-clamp-2">{habit.description}</p>
              ) : null}
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span
                data-testid={`habit-streak-${slug}`}
                className="text-2xl font-bold text-streak"
              >
                {streak}🔥
              </span>
              <span className="text-xs text-secondary-text uppercase tracking-wide">Streak</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2 justify-end">
            <Button
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
              data-testid={`habit-edit-${slug}`}
              variant="ghost"
              size="icon"
              title="Edit Habit"
            >
              <IconEdit />
            </Button>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                setIsDeleting(true);
              }}
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
      </div>
    </div>
  );
}
