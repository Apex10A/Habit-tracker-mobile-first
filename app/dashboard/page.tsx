'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, logout } from '@/lib/auth';
import { getHabits } from '@/lib/habits';
import type { Session } from '@/types/auth';
import type { Habit } from '@/types/habit';
import HabitForm from '@/components/habits/HabitForm';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import EmptyState from '@/components/dashboard/EmptyState';
import TodayProgress from '@/components/dashboard/TodayProgress';
import TodayHabitsList from '@/components/dashboard/TodayHabitsList';
import WeeklyStatsSummary from '@/components/dashboard/WeeklyStatsSummary';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { formatTodayHeading } from '@/lib/today';
import Card from '@/components/ui/Card';

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const router = useRouter();

  const loadHabits = (userId: string) => {
    const allHabits = getHabits();
    const userHabits = allHabits.filter((h) => h.userId === userId);
    setHabits(userHabits);
  };

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.push('/login');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(currentSession);
    loadHabits(currentSession.userId);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    logout();
  };

  const handleSuccess = () => {
    if (session) {
      loadHabits(session.userId);
    }
    setShowForm(false);
    setEditingHabit(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  if (loading) {
    return (
      <div data-testid="dashboard-page">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <DashboardShell
      session={session!}
      subtitle={`${formatTodayHeading()} · Welcome back, ${session?.email}`}
      onLogout={handleLogout}
      onCreateHabit={() => setShowForm(true)}
    >
      {(showForm || editingHabit) && session && (
        <HabitForm
          userId={session.userId}
          habitToEdit={editingHabit || undefined}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}

      {habits.length === 0 ? (
        <Card padding="md">
          <EmptyState onCreateHabit={() => setShowForm(true)} />
        </Card>
      ) : (
        <>
          <TodayProgress habits={habits} />
          <div id="weekly-stats">
            <WeeklyStatsSummary habits={habits} />
          </div>
          <TodayHabitsList
            habits={habits}
            onUpdate={() => session && loadHabits(session.userId)}
            onEdit={setEditingHabit}
          />
        </>
      )}
    </DashboardShell>
  );
}
