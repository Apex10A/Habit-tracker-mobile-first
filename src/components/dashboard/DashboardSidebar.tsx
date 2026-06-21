'use client';

import Link from 'next/link';
import type { Session } from '@/types/auth';
import { IconLayoutGrid, IconTrending, IconX } from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/cn';

type DashboardSidebarProps = {
  session: Session;
  mobileOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
};

const navItems = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: IconLayoutGrid,
    active: true,
  },
  {
    href: '/dashboard#weekly-stats',
    label: 'Weekly stats',
    icon: IconTrending,
    active: false,
  },
];

function getInitials(email: string): string {
  return email.charAt(0).toUpperCase();
}

export default function DashboardSidebar({
  session,
  mobileOpen,
  onClose,
  onLogout,
}: DashboardSidebarProps) {
  const sidebarContent = (
    <>
      <div className="px-5 py-6 border-b border-border-base">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink font-display text-lg font-bold text-foreground shadow-pink">
            H
          </span>
          <div>
            <p className="font-display text-lg font-bold text-foreground leading-tight">Habit Tracker</p>
            <p className="text-xs text-secondary-text">Daily check-ins</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Dashboard navigation">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                item.active
                  ? 'bg-accent-muted/70 text-foreground shadow-sm'
                  : 'text-secondary-text hover:bg-background hover:text-foreground'
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-base p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-background p-3 mb-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple font-display text-sm font-bold text-foreground">
            {getInitials(session.email)}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{session.email}</p>
            <p className="text-xs text-secondary-text">Signed in</p>
          </div>
        </div>
        <Button
          onClick={onLogout}
          data-testid="auth-logout-button"
          variant="ghost"
          fullWidth
          className="justify-start bg-danger-muted text-danger hover:bg-danger/20 focus:ring-danger"
        >
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-overlay lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        data-testid="dashboard-sidebar"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border-base bg-surface shadow-lg transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-end px-3 pt-3 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-xl p-2 text-secondary-text hover:bg-background hover:text-foreground"
          >
            <IconX size={20} />
          </button>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
}
