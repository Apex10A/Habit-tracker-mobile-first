import {
  buildHeatmap,
  countHeatmapCompletions,
  countTrackableDays,
  getHeatmapCompletionRate,
  parseLocalDate,
} from '../../src/lib/heatmap';

describe('buildHeatmap', () => {
  it('marks completed days inside the heatmap range', () => {
    const grid = buildHeatmap(
      ['2026-06-18', '2026-06-19', '2026-06-20'],
      '2026-06-01T00:00:00.000Z',
      { endDate: parseLocalDate('2026-06-20'), weeks: 4 }
    );

    const completedCells = grid.weeks.flat().filter((cell) => cell.completed);
    expect(completedCells).toHaveLength(3);
    expect(completedCells.map((cell) => cell.date)).toEqual([
      '2026-06-18',
      '2026-06-19',
      '2026-06-20',
    ]);
  });

  it('does not mark days before the habit was created as trackable', () => {
    const grid = buildHeatmap([], '2026-06-15T00:00:00.000Z', {
      endDate: parseLocalDate('2026-06-20'),
      weeks: 2,
    });

    const earlyCells = grid.weeks.flat().filter((cell) => cell.date < '2026-06-15');
    expect(earlyCells.every((cell) => cell.trackable === false)).toBe(true);
  });

  it('builds eight week columns by default', () => {
    const grid = buildHeatmap([], '2026-01-01T00:00:00.000Z', {
      endDate: parseLocalDate('2026-06-20'),
    });

    expect(grid.weeks).toHaveLength(8);
    expect(grid.weeks[0]).toHaveLength(7);
  });
});

describe('heatmap stats', () => {
  it('calculates completion rate from trackable days only', () => {
    const grid = buildHeatmap(
      ['2026-06-19', '2026-06-20'],
      '2026-06-19T00:00:00.000Z',
      { endDate: parseLocalDate('2026-06-20'), weeks: 1 }
    );

    expect(countTrackableDays(grid)).toBe(2);
    expect(countHeatmapCompletions(grid)).toBe(2);
    expect(getHeatmapCompletionRate(grid)).toBe(100);
  });

  it('returns zero when there are no trackable days', () => {
    const grid = buildHeatmap([], '2026-06-21T00:00:00.000Z', {
      endDate: parseLocalDate('2026-06-20'),
      weeks: 1,
    });

    expect(getHeatmapCompletionRate(grid)).toBe(0);
  });
});
