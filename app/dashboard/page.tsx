'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, logout } from '@/lib/auth';
import { getHabits } from '@/lib/habits';
import type { Session } from '@/types/auth';
import type { Habit } from '@/types/habit';
import HabitForm from '@/components/habits/HabitForm';
import HabitCard from '@/components/habits/HabitCard';

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
      <div className="flex min-h-screen items-center justify-center" data-testid="dashboard-page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8" data-testid="dashboard-page">
      <header className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {session?.email}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowForm(true)}
            data-testid="create-habit-button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
          >
            Create Habit
          </button>
          <button
            onClick={handleLogout}
            data-testid="auth-logout-button"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
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
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Your Habits</h2>
          {habits.length === 0 ? (
            <div data-testid="empty-state" className="text-gray-500 text-center py-12">
              <p className="text-lg">No habits yet. Create your first one!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onUpdate={() => session && loadHabits(session.userId)}
                  onEdit={() => setEditingHabit(habit)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
