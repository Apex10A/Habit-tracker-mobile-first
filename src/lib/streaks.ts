export const calculateCurrentStreak = (
  completions: string[],
  todayOverride?: string
): number => {
  const today = todayOverride || new Date().toISOString().split('T')[0];
  const completionSet = new Set(completions);

  if (!completionSet.has(today)) {
    return 0;
  }

  let streak = 0;
  let currentDate = new Date(today);

  while (completionSet.has(currentDate.toISOString().split('T')[0])) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
};
