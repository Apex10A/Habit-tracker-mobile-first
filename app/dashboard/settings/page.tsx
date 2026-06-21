'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, logout } from '@/lib/auth';
import type { Session } from '@/types/auth';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import DataBackupPanel from '@/components/settings/DataBackupPanel';

export default function SettingsPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.push('/login');
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(currentSession);
    setLoading(false);
  }, [router, refreshKey]);

  if (loading) {
    return (
      <div data-testid="settings-page">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <DashboardShell
      session={session!}
      title="Settings"
      subtitle="Manage your account data and backups"
      testId="settings-page"
      onLogout={() => logout()}
      onCreateHabit={() => router.push('/dashboard')}
    >
      <DataBackupPanel
        userId={session!.userId}
        onImported={() => setRefreshKey((value) => value + 1)}
      />
    </DashboardShell>
  );
}
