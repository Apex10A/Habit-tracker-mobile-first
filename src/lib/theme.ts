export const THEME_STORAGE_KEY = 'habit-tracker-theme';

export type Theme = 'light' | 'dark';

export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : null;
}

export function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = getStoredTheme();
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function toggleTheme(): Theme {
  const next: Theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next);
  return next;
}
