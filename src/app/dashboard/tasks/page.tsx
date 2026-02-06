"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import { TaskList, TaskForm } from "@/components/features/tasks";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const statusFilters = [
  { value: "all", label: "All" },
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
  { value: "backlog", label: "Backlog" },
];

export default function TasksPage() {
  const [filter, setFilter] = useState("all");
  const convexUser = useCurrentUser();
  const tasks = useQuery(
    api.functions.tasks.listByUser,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  );

  const filteredTasks =
    tasks && filter !== "all"
      ? tasks.filter((t) => t.status === filter)
      : tasks;

  if (tasks === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-cyan-500/5 border border-cyan-500/10" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
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
            <span className="text-cyan-400">&gt;</span> Tasks
          </h1>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} across all projects
          </p>
        </div>
        {convexUser && <TaskForm userId={convexUser._id} />}
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap">
        {statusFilters.map((sf) => (
          <button
            key={sf.value}
            onClick={() => setFilter(sf.value)}
            className={cn(
              "rounded-lg border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-200",
              filter === sf.value
                ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                : "border-border text-muted-foreground hover:border-cyan-500/20 hover:text-foreground"
            )}
          >
            {sf.label}
            {sf.value !== "all" && tasks && (
              <span className="ml-1.5 text-muted-foreground">
                {tasks.filter((t) => t.status === sf.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <TaskList tasks={filteredTasks ?? []} showProject />
    </div>
  );
}
