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
import ThemeToggle from '@/components/shared/ThemeToggle';
import Button from '@/components/ui/Button';
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
    <div className="min-h-screen bg-background p-4 md:p-8" data-testid="dashboard-page">
      <header className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8 max-w-4xl mx-auto">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-secondary-text text-sm md:text-base">Welcome back, {session?.email}</p>
        </div>
        <div className="flex gap-2 md:gap-4 items-center">
          <ThemeToggle />
          <Button
            onClick={() => setShowForm(true)}
            data-testid="create-habit-button"
            className="flex-1 md:flex-none"
          >
            Create Habit
          </Button>
          <Button
            onClick={handleLogout}
            data-testid="auth-logout-button"
            variant="ghost"
            className="bg-danger-muted text-danger hover:bg-danger/20 focus:ring-danger"
          >
            Logout
          </Button>
        </div>
      </header>

      {(showForm || editingHabit) && session && (
        <HabitForm
          userId={session.userId}
          habitToEdit={editingHabit || undefined}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}

      <main className="max-w-4xl mx-auto">
        {habits.length === 0 ? (
          <Card padding="md">
            <EmptyState onCreateHabit={() => setShowForm(true)} />
          </Card>
        ) : (
          <>
            <TodayProgress habits={habits} />
            <WeeklyStatsSummary habits={habits} />
            <TodayHabitsList
              habits={habits}
              onUpdate={() => session && loadHabits(session.userId)}
              onEdit={setEditingHabit}
            />
          </>
        )}
      </main>
    </div>
  );
}
