import type { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'Habit Tracker — Build habits that stick',
  description:
    'Track daily habits, build streaks, and stay consistent with a calm, offline-first PWA.',
};

export default function Home() {
  return <LandingPage />;
}
