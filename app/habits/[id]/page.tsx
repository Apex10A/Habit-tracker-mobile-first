'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getHabitById, toggleHabitCompletion, updateHabit } from '@/lib/habits';
import { getHabitColorOption } from '@/lib/habitAppearance';
import { calculateCurrentStreak } from '@/lib/streaks';
import { getLocalDateString } from '@/lib/today';
import { HEATMAP_WEEKS, buildHeatmap, getHeatmapCompletionRate } from '@/lib/heatmap';
import type { Habit } from '@/types/habit';
import CompletionHeatmap from '@/components/habits/CompletionHeatmap';
import ThemeToggle from '@/components/shared/ThemeToggle';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';

export default function HabitDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const today = getLocalDateString();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push('/login');
      return;
    }

    const currentHabit = getHabitById(params.id, session.userId);
    if (!currentHabit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotFound(true);
      setHabit(null);
      setLoading(false);
      return;
    }

    setHabit(currentHabit);
    setNotFound(false);
    setLoading(false);
  }, [params.id, router]);

  const stats = useMemo(() => {
    if (!habit) return null;

    const grid = buildHeatmap(habit.completions, habit.createdAt);
    const isCompletedToday = habit.completions.includes(today);

    return {
      currentStreak: calculateCurrentStreak(habit.completions, today),
      totalCompletions: habit.completions.length,
      recentCompletionRate: getHeatmapCompletionRate(grid),
      isCompletedToday,
    };
  }, [habit, today]);

  const handleToggleToday = () => {
    if (!habit) return;

    const updatedHabit = toggleHabitCompletion(habit, today);
    updateHabit(updatedHabit);
    setHabit(updatedHabit);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8" data-testid="habit-detail-loading">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (notFound || !habit || !stats) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8" data-testid="habit-detail-not-found">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/dashboard"
            className="text-sm text-secondary-text hover:text-foreground transition-colors"
          >
            ← Back to dashboard
          </Link>
          <Card padding="md" className="mt-8 text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">Habit not found</h1>
            <p className="mt-2 text-secondary-text">
              This habit may have been deleted or you do not have access to it.
            </p>
            <Button className="mt-6" onClick={() => router.push('/dashboard')}>
              Return to dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const colorOption = getHabitColorOption(habit.color);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8" data-testid="habit-detail-page">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/dashboard"
            data-testid="habit-detail-back-link"
            className="text-sm text-secondary-text hover:text-foreground transition-colors"
          >
            ← Back to dashboard
          </Link>
          <ThemeToggle />
        </header>

        <Card
          padding="md"
          className={cn('mb-6 border-l-4', colorOption.borderClass)}
          data-testid="habit-detail-header"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                {habit.emoji ? (
                  <span
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl',
                      colorOption.tintClass
                    )}
                    aria-hidden="true"
                  >
                    {habit.emoji}
                  </span>
                ) : null}
                <div className="min-w-0">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground truncate">
                    {habit.name}
                  </h1>
                  {habit.description ? (
                    <p className="mt-1 text-secondary-text">{habit.description}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <Button
              onClick={handleToggleToday}
              data-testid="habit-detail-toggle-today"
              variant={stats.isCompletedToday ? 'success' : 'primary'}
              className="shrink-0"
            >
              {stats.isCompletedToday ? 'Completed today' : 'Complete today'}
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-background border border-border-base p-4 text-center">
              <p className="text-2xl font-bold text-streak" data-testid="habit-detail-current-streak">
                {stats.currentStreak}🔥
              </p>
              <p className="text-xs uppercase tracking-wide text-secondary-text mt-1">Current streak</p>
            </div>
            <div className="rounded-2xl bg-background border border-border-base p-4 text-center">
              <p className="text-2xl font-bold text-foreground" data-testid="habit-detail-total-completions">
                {stats.totalCompletions}
              </p>
              <p className="text-xs uppercase tracking-wide text-secondary-text mt-1">Total check-ins</p>
            </div>
            <div className="rounded-2xl bg-background border border-border-base p-4 text-center">
              <p className="text-2xl font-bold text-accent" data-testid="habit-detail-recent-rate">
                {stats.recentCompletionRate}%
              </p>
              <p className="text-xs uppercase tracking-wide text-secondary-text mt-1">
                Last {HEATMAP_WEEKS} weeks
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <CompletionHeatmap habit={habit} />
        </Card>
      </div>
    </div>
  );
}
