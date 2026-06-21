'use client';

import Card from '@/components/ui/Card';
import type { Habit } from '@/types/habit';
import { formatWeekRange, getDashboardWeeklyStats } from '@/lib/stats';
import { cn } from '@/lib/cn';

type WeeklyStatsSummaryProps = {
  habits: Habit[];
};

export default function WeeklyStatsSummary({ habits }: WeeklyStatsSummaryProps) {
  const stats = getDashboardWeeklyStats(habits);
  const weekLabel = formatWeekRange(stats.weekStart, stats.weekEnd);

  return (
    <Card padding="md" className="mb-6" data-testid="weekly-stats-summary">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-secondary-text">This week</p>
          <h2 className="font-display text-xl font-bold text-foreground">{weekLabel}</h2>
          <p className="mt-1 text-secondary-text" data-testid="weekly-stats-summary-text">
            {stats.total === 0
              ? 'No check-ins due yet this week'
              : `${stats.completed} of ${stats.total} check-ins completed · ${stats.percentage}%`}
          </p>
        </div>

        <div className="sm:w-40 text-right">
          <p className="font-display text-3xl font-bold text-accent" data-testid="weekly-stats-percentage">
            {stats.percentage}%
          </p>
          <p className="text-xs uppercase tracking-wide text-secondary-text">Weekly rate</p>
        </div>
      </div>

      <div className="mt-4 h-2 rounded-full bg-border-base overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            stats.percentage === 100 ? 'bg-success' : 'bg-accent'
          )}
          style={{ width: `${stats.percentage}%` }}
          role="progressbar"
          aria-valuenow={stats.percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${stats.percentage}% of this week's check-ins completed`}
        />
      </div>
    </Card>
  );
}
