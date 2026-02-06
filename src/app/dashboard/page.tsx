"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ProjectGrid } from "@/components/features/projects";
import { ProjectForm } from "@/components/features/projects";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const convexUser = useCurrentUser();
  const projects = useQuery(
    api.functions.projects.list,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  );

  if (projects === undefined) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 bg-cyan-500/5 border border-cyan-500/10" />
          <Skeleton className="h-10 w-32 bg-cyan-500/5 border border-cyan-500/10" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl bg-cyan-500/5 border border-cyan-500/10" />
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
            <span className="text-cyan-400">&gt;</span> Projects
          </h1>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? "s" : ""} initialized
          </p>
        </div>
        {convexUser && <ProjectForm userId={convexUser._id} />}
      </div>
      <ProjectGrid projects={projects} />
    </div>
  );
}
