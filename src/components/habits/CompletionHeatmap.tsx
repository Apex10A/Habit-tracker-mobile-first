'use client';

import type { Habit } from '@/types/habit';
import {
  HEATMAP_WEEKS,
  buildHeatmap,
  formatHeatmapDateLabel,
  getHeatmapCompletionRate,
} from '@/lib/heatmap';
import { getHabitColorOption } from '@/lib/habitAppearance';
import { cn } from '@/lib/cn';

type CompletionHeatmapProps = {
  habit: Habit;
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CompletionHeatmap({ habit }: CompletionHeatmapProps) {
  const grid = buildHeatmap(habit.completions, habit.createdAt);
  const completionRate = getHeatmapCompletionRate(grid);
  const colorOption = getHabitColorOption(habit.color);

  return (
    <section data-testid="completion-heatmap">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between mb-4">
        <div>
          <h2 className="font-display text-lg font-medium text-foreground">Activity</h2>
          <p className="text-sm text-secondary-text">
            Last {HEATMAP_WEEKS} weeks · {completionRate}% completion rate
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-secondary-text">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-border-base" aria-hidden="true" />
            Missed
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className={cn('h-3 w-3 rounded-sm', colorOption.swatchClass)} aria-hidden="true" />
            Completed
          </span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-max">
          <div className="grid grid-flow-col auto-cols-[14px] gap-1 mb-2 pl-8">
            {grid.weeks.map((_, weekIndex) => {
              const label = grid.monthLabels.find((entry) => entry.weekIndex === weekIndex);

              return (
                <div key={`month-${weekIndex}`} className="h-4 text-[10px] text-secondary-text">
                  {label?.label ?? ''}
                </div>
              );
            })}
          </div>

          <div className="flex gap-1">
            <div className="grid grid-rows-7 gap-1 pr-1 text-[10px] text-secondary-text">
              {DAY_LABELS.map((label, index) => (
                <div
                  key={label}
                  className={cn('h-3.5 flex items-center', index % 2 === 0 ? 'opacity-100' : 'opacity-0 sm:opacity-100')}
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="grid grid-flow-col auto-cols-[14px] gap-1">
              {grid.weeks.map((week, weekIndex) => (
                <div key={`week-${weekIndex}`} className="grid grid-rows-7 gap-1">
                  {week.map((cell) => (
                    <div
                      key={cell.date}
                      data-testid={`heatmap-cell-${cell.date}`}
                      data-completed={cell.completed ? 'true' : 'false'}
                      data-trackable={cell.trackable ? 'true' : 'false'}
                      title={
                        cell.trackable
                          ? `${formatHeatmapDateLabel(cell.date)} · ${cell.completed ? 'Completed' : 'Missed'}`
                          : formatHeatmapDateLabel(cell.date)
                      }
                      aria-label={
                        cell.trackable
                          ? `${formatHeatmapDateLabel(cell.date)}, ${cell.completed ? 'completed' : 'missed'}`
                          : `${formatHeatmapDateLabel(cell.date)}, not tracked yet`
                      }
                      className={cn(
                        'h-3.5 w-3.5 rounded-sm border transition-colors',
                        !cell.trackable && 'border-border-base/40 bg-background',
                        cell.trackable && !cell.completed && 'border-border-base bg-border-base/70',
                        cell.trackable && cell.completed && cn('border-transparent', colorOption.swatchClass)
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
