'use client';

import ThemeToggle from '@/components/shared/ThemeToggle';
import Button from '@/components/ui/Button';
import { IconMenu } from '@/components/ui/Icon';

type DashboardHeaderProps = {
  title: string;
  subtitle: string;
  onOpenMenu: () => void;
  onCreateHabit: () => void;
};

export default function DashboardHeader({
  title,
  subtitle,
  onOpenMenu,
  onCreateHabit,
}: DashboardHeaderProps) {
  return (
    <header
      data-testid="dashboard-header"
      className="sticky top-0 z-30 border-b border-border-base bg-background/90 backdrop-blur-sm"
    >
      <div className="flex flex-col gap-4 px-4 py-4 md:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <button
            type="button"
            aria-label="Open navigation menu"
            data-testid="dashboard-menu-button"
            onClick={onOpenMenu}
            className="mt-0.5 rounded-xl p-2.5 text-secondary-text hover:bg-surface hover:text-foreground lg:hidden"
          >
            <IconMenu size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground truncate">
              {title}
            </h1>
            <p className="text-secondary-text text-sm md:text-base truncate">{subtitle}</p>
          </div>
        </div>

        <div className="flex gap-2 md:gap-3 items-center pl-12 lg:pl-0">
          <ThemeToggle />
          <Button
            onClick={onCreateHabit}
            data-testid="create-habit-button"
            className="flex-1 md:flex-none"
          >
            Create Habit
          </Button>
        </div>
      </div>
    </header>
  );
}
