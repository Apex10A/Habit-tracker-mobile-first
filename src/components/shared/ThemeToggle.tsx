'use client';

import { useEffect, useState } from 'react';
import { applyTheme, type Theme } from '@/lib/theme';

function IconSun({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={20}
      height={20}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function IconMoon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={20}
      height={20}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  }, []);

  const handleToggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      data-testid="theme-toggle"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title={theme === 'light' ? 'Dark mode' : 'Light mode'}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-surface text-foreground shadow-sm hover:bg-background transition-colors ${className}`}
    >
      {theme === 'light' ? <IconMoon /> : <IconSun />}
    </button>
  );
}
