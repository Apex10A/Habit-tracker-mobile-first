import Skeleton from '@/components/ui/Skeleton';
import ThemeToggle from '@/components/shared/ThemeToggle';

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8" data-testid="dashboard-skeleton">
      <header className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8 max-w-4xl mx-auto">
        <div className="space-y-3">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-5 w-56" />
        </div>
        <div className="flex gap-2 md:gap-4 items-center">
          <ThemeToggle />
          <Skeleton className="h-10 flex-1 md:w-36 md:flex-none" />
          <Skeleton className="h-10 w-24" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <section className="bg-surface rounded-2xl shadow-md p-6">
          <Skeleton className="h-7 w-32 mb-6" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36 md:col-span-2 md:max-w-[calc(50%-0.5rem)]" />
          </div>
        </section>
      </main>
    </div>
  );
}
