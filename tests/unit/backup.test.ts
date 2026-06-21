import type { Habit } from '../../src/types/habit';
import {
  BACKUP_VERSION,
  createBackupPayload,
  importBackup,
  parseBackup,
  serializeBackup,
} from '../../src/lib/backup';
import { getUserHabits } from '../../src/lib/habits';

const sampleHabit: Habit = {
  id: 'habit-1',
  userId: 'user-1',
  name: 'Read',
  description: '10 minutes',
  frequency: 'daily',
  color: 'blue',
  emoji: '📚',
  createdAt: '2026-01-01T00:00:00.000Z',
  completions: ['2026-06-20'],
};

describe('createBackupPayload', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('includes only the current user habits', () => {
    localStorage.setItem(
      'habit-tracker-habits',
      JSON.stringify([
        sampleHabit,
        { ...sampleHabit, id: 'habit-2', userId: 'other-user' },
      ])
    );

    const payload = createBackupPayload('user-1');

    expect(payload.version).toBe(BACKUP_VERSION);
    expect(payload.userId).toBe('user-1');
    expect(payload.habits).toHaveLength(1);
    expect(payload.habits[0].id).toBe('habit-1');
  });
});

describe('parseBackup', () => {
  it('rejects invalid JSON', () => {
    expect(parseBackup('{not json')).toEqual({
      ok: false,
      error: 'Invalid JSON file.',
    });
  });

  it('rejects unsupported backup versions', () => {
    expect(
      parseBackup(JSON.stringify({ version: 99, userId: 'user-1', habits: [] }))
    ).toEqual({
      ok: false,
      error: 'Unsupported backup version.',
    });
  });

  it('parses a valid backup file', () => {
    const raw = serializeBackup({
      version: BACKUP_VERSION,
      exportedAt: '2026-06-20T00:00:00.000Z',
      userId: 'user-1',
      habits: [sampleHabit],
    });

    const result = parseBackup(raw);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.payload.habits[0].name).toBe('Read');
      expect(result.payload.habits[0].color).toBe('blue');
    }
  });
});

describe('importBackup', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('replaces the current user habits with imported data', () => {
    localStorage.setItem(
      'habit-tracker-habits',
      JSON.stringify([{ ...sampleHabit, id: 'old-habit', name: 'Old Habit' }])
    );

    const raw = serializeBackup({
      version: BACKUP_VERSION,
      exportedAt: '2026-06-20T00:00:00.000Z',
      userId: 'user-1',
      habits: [sampleHabit],
    });

    const result = importBackup('user-1', raw);

    expect(result).toEqual({ ok: true, importedCount: 1 });
    expect(getUserHabits('user-1')).toEqual([sampleHabit]);
  });

  it('does not overwrite another user habits', () => {
    localStorage.setItem(
      'habit-tracker-habits',
      JSON.stringify([{ ...sampleHabit, id: 'other-habit', userId: 'other-user' }])
    );

    const raw = serializeBackup({
      version: BACKUP_VERSION,
      exportedAt: '2026-06-20T00:00:00.000Z',
      userId: 'user-1',
      habits: [sampleHabit],
    });

    importBackup('user-1', raw);

    expect(getUserHabits('other-user')).toHaveLength(1);
    expect(getUserHabits('user-1')).toHaveLength(1);
  });
});
