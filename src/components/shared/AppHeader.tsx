import Link from 'next/link';
import ThemeToggle from '@/components/shared/ThemeToggle';

export default function AppHeader() {
  return (
    <header className="border-b border-border-base bg-background/90 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-bold tracking-tight text-foreground">
          Habit Tracker
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
