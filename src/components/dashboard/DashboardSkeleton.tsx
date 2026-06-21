import Skeleton from '@/components/ui/Skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background flex" data-testid="dashboard-skeleton">
      <aside className="hidden w-64 flex-col border-r border-border-base bg-surface lg:flex">
        <div className="px-5 py-6 border-b border-border-base">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
        <div className="flex-1 px-3 py-4 space-y-2">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div className="border-t border-border-base p-4 space-y-3">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-border-base px-4 py-4 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-9 w-40" />
              <Skeleton className="h-5 w-56" />
            </div>
            <div className="flex gap-2 md:gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-10 w-36" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-5xl space-y-6">
            <section className="bg-surface rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-6">
                <Skeleton className="h-[88px] w-[88px] rounded-full shrink-0" />
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-5 w-40" />
                </div>
              </div>
            </section>

            <section className="bg-surface rounded-2xl shadow-md p-6">
              <Skeleton className="h-6 w-24 mb-3" />
              <Skeleton className="h-4 w-56 mb-4" />
              <Skeleton className="h-2 w-full rounded-full" />
            </section>

            <section>
              <Skeleton className="h-6 w-28 mb-3" />
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-36" />
                <Skeleton className="h-36" />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
