import { getLocalDateString } from '@/lib/today';

export const HEATMAP_WEEKS = 8;

export type HeatmapCell = {
  date: string;
  completed: boolean;
  trackable: boolean;
};

export type HeatmapGrid = {
  weeks: HeatmapCell[][];
  monthLabels: { weekIndex: number; label: string }[];
};

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date): Date {
  const weekStart = startOfDay(date);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  return weekStart;
}

export function buildHeatmap(
  completions: string[],
  createdAt: string,
  options?: { weeks?: number; endDate?: Date }
): HeatmapGrid {
  const weeks = options?.weeks ?? HEATMAP_WEEKS;
  const endDate = startOfDay(options?.endDate ?? new Date());
  const completionSet = new Set(completions);
  const createdDate = startOfDay(parseLocalDate(getLocalDateString(new Date(createdAt))));

  const gridEndWeekStart = startOfWeek(endDate);
  const gridStart = new Date(gridEndWeekStart);
  gridStart.setDate(gridStart.getDate() - (weeks - 1) * 7);

  const columns: HeatmapCell[][] = [];

  for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
    const weekStart = new Date(gridStart);
    weekStart.setDate(weekStart.getDate() + weekIndex * 7);
    const column: HeatmapCell[] = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const cellDate = new Date(weekStart);
      cellDate.setDate(cellDate.getDate() + dayIndex);
      const date = getLocalDateString(cellDate);

      column.push({
        date,
        completed: completionSet.has(date),
        trackable: cellDate >= createdDate && cellDate <= endDate,
      });
    }

    columns.push(column);
  }

  const monthLabels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;

  for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
    const month = parseLocalDate(columns[weekIndex][0].date).getMonth();
    if (month !== lastMonth) {
      monthLabels.push({
        weekIndex,
        label: new Intl.DateTimeFormat(undefined, { month: 'short' }).format(
          parseLocalDate(columns[weekIndex][0].date)
        ),
      });
      lastMonth = month;
    }
  }

  return { weeks: columns, monthLabels };
}

export function countHeatmapCompletions(grid: HeatmapGrid): number {
  return grid.weeks.flat().filter((cell) => cell.trackable && cell.completed).length;
}

export function countTrackableDays(grid: HeatmapGrid): number {
  return grid.weeks.flat().filter((cell) => cell.trackable).length;
}

export function getHeatmapCompletionRate(grid: HeatmapGrid): number {
  const trackableDays = countTrackableDays(grid);
  if (trackableDays === 0) return 0;
  return Math.round((countHeatmapCompletions(grid) / trackableDays) * 100);
}

export function formatHeatmapDateLabel(date: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parseLocalDate(date));
}
