import { getLocalDateString } from './today';
import { parseLocalDate } from './heatmap';

export const calculateCurrentStreak = (
  completions: string[],
  todayOverride?: string
): number => {
  const today = todayOverride || getLocalDateString();
  const completionSet = new Set(completions);

  if (!completionSet.has(today)) {
    return 0;
  }

  let streak = 0;
  const currentDate = parseLocalDate(today);

  while (completionSet.has(getLocalDateString(currentDate))) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
};

export const calculateBestStreak = (completions: string[]): number => {
  const uniqueDates = [...new Set(completions)].sort();
  if (uniqueDates.length === 0) return 0;
  if (uniqueDates.length === 1) return 1;

  let best = 1;
  let current = 1;

  for (let index = 1; index < uniqueDates.length; index++) {
    const previous = parseLocalDate(uniqueDates[index - 1]);
    previous.setDate(previous.getDate() + 1);

    if (getLocalDateString(previous) === uniqueDates[index]) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }

  return best;
};
