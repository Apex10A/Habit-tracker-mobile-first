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
      className="flex h-screen w-screen items-center justify-center bg-white"
    >
      <h1 className="text-4xl font-bold text-gray-900">Habit Tracker</h1>
    </div>
  );
}
