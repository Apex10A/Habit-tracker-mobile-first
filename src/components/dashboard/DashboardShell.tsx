'use client';

import { useState, type ReactNode } from 'react';
import type { Session } from '@/types/auth';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

type DashboardShellProps = {
  session: Session;
  title?: string;
  subtitle: string;
  onLogout: () => void;
  onCreateHabit: () => void;
  testId?: string;
  children: ReactNode;
};

export default function DashboardShell({
  session,
  title = 'Overview',
  subtitle,
  onLogout,
  onCreateHabit,
  testId = 'dashboard-page',
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex" data-testid={testId}>
      <DashboardSidebar
        session={session}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={onLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          onOpenMenu={() => setMobileOpen(true)}
          onCreateHabit={onCreateHabit}
        />

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
