import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Title skeleton */}
      <div>
        <Skeleton className="h-9 w-48 bg-cyan-500/5 border border-cyan-500/10" />
        <Skeleton className="mt-2 h-5 w-64 bg-cyan-500/5 border border-cyan-500/10" />
      </div>

      {/* Project cards skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-cyan-500/10 bg-card p-6"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg bg-cyan-500/5" />
                <div>
                  <Skeleton className="h-5 w-32 bg-cyan-500/5" />
                  <Skeleton className="mt-1 h-4 w-48 bg-cyan-500/5" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-md bg-cyan-500/5" />
            </div>
            <div className="mt-4 flex items-center gap-4 border-t border-cyan-500/10 pt-4">
              <Skeleton className="h-4 w-20 bg-cyan-500/5" />
              <Skeleton className="h-4 w-16 bg-cyan-500/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
