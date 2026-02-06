"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ResourceGrid, ResourceUpload } from "@/components/features/resources";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResourcesPage() {
  const convexUser = useCurrentUser();
  const resources = useQuery(
    api.functions.resources.listByUser,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  );

  if (resources === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-cyan-500/5 border border-cyan-500/10" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl bg-cyan-500/5 border border-cyan-500/10" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">
            <span className="text-cyan-400">&gt;</span> Resources
          </h1>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            {resources.length} file{resources.length !== 1 ? "s" : ""} across all projects
          </p>
        </div>
        {convexUser && <ResourceUpload userId={convexUser._id} />}
      </div>
      <ResourceGrid resources={resources} showProject />
    </div>
  );
}
