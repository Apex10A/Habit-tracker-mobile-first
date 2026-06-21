import type { Habit } from '@/types/habit';
import { normalizeHabit } from '@/lib/habitAppearance';
import { getUserHabits, replaceUserHabits } from '@/lib/habits';
import { getLocalDateString } from '@/lib/today';

export const BACKUP_VERSION = 1;

export type HabitBackupPayload = {
  version: number;
  exportedAt: string;
  userId: string;
  habits: Habit[];
};

export type ImportBackupResult =
  | { ok: true; importedCount: number }
  | { ok: false; error: string };

export function createBackupPayload(userId: string): HabitBackupPayload {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    userId,
    habits: getUserHabits(userId),
  };
}

export function serializeBackup(payload: HabitBackupPayload): string {
  return JSON.stringify(payload, null, 2);
}

export function parseBackup(
  raw: string
): { ok: true; payload: HabitBackupPayload } | { ok: false; error: string } {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: 'Invalid JSON file.' };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { ok: false, error: 'Backup file is missing required data.' };
  }

  const record = parsed as Record<string, unknown>;

  if (record.version !== BACKUP_VERSION) {
    return { ok: false, error: 'Unsupported backup version.' };
  }

  if (typeof record.userId !== 'string' || !Array.isArray(record.habits)) {
    return { ok: false, error: 'Backup file is missing required data.' };
  }

  const habits = record.habits.map((habit) =>
    normalizeHabit({ ...(habit as Record<string, unknown>), userId: record.userId })
  );

  return {
    ok: true,
    payload: {
      version: BACKUP_VERSION,
      exportedAt: typeof record.exportedAt === 'string' ? record.exportedAt : new Date().toISOString(),
      userId: record.userId,
      habits,
    },
  };
}

export function importBackup(userId: string, raw: string): ImportBackupResult {
  const parsed = parseBackup(raw);

  if (!parsed.ok) {
    return parsed;
  }

  const habits = parsed.payload.habits.map((habit) => ({
    ...habit,
    userId,
  }));

  replaceUserHabits(userId, habits);

  return {
    ok: true,
    importedCount: habits.length,
  };
}

export function downloadBackup(userId: string): void {
  if (typeof window === 'undefined') return;

  const payload = createBackupPayload(userId);
  const blob = new Blob([serializeBackup(payload)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `habit-tracker-backup-${getLocalDateString()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
