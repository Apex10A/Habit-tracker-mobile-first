'use client';

import Card from '@/components/ui/Card';
import type { Habit } from '@/types/habit';
import { formatTodayHeading, getTodayProgress } from '@/lib/today';

type TodayProgressProps = {
  habits: Habit[];
};

const RING_SIZE = 88;
const STROKE_WIDTH = 8;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function TodayProgress({ habits }: TodayProgressProps) {
  const progress = getTodayProgress(habits);
  const offset = CIRCUMFERENCE - (progress.percentage / 100) * CIRCUMFERENCE;
  const isComplete = progress.total > 0 && progress.completed === progress.total;

  return (
    <Card padding="md" className="mb-6" data-testid="today-progress">
      <div className="flex items-center gap-6">
        <div className="relative shrink-0" aria-hidden="true">
          <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE_WIDTH}
              className="text-border-base"
            />
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className={isComplete ? 'text-success transition-all duration-500' : 'text-accent transition-all duration-500'}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-lg font-bold text-foreground">
              {progress.completed}/{progress.total}
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-secondary-text">Today</p>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
            {formatTodayHeading()}
          </h2>
          <p className="mt-1 text-secondary-text" data-testid="today-progress-summary">
            {progress.total === 0
              ? 'No habits yet'
              : isComplete
                ? 'All habits done — nice work!'
                : `${progress.completed} of ${progress.total} habit${progress.total === 1 ? '' : 's'} done today`}
          </p>
        </div>
      </div>
    </Card>
  );
}
