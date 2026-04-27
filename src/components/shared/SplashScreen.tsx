'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }, 1200); // Between 800ms and 2000ms

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      data-testid="splash-screen"
      className="flex flex-col h-screen w-screen items-center justify-center bg-background animate-in fade-in duration-700"
    >
      <div className="mb-6 animate-bounce">
        <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-foreground tracking-tight">Habit Tracker</h1>
      <p className="mt-2 text-secondary-text animate-pulse">Building better days...</p>
    </div>
  );
}
