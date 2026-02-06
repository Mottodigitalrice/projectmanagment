"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { GlowCard } from "@/components/shared/glow-card";
import { cn } from "@/lib/utils";
import { Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import type { Id } from "../../../../convex/_generated/dataModel";

interface Task {
  _id: Id<"tasks">;
  title: string;
  description?: string;
  status: "backlog" | "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  projectId: Id<"projects">;
  dueDate?: number;
  createdAt: number;
}

interface TaskCardProps {
  task: Task;
  showProject?: boolean;
}

const priorityColors: Record<string, string> = {
  low: "text-muted-foreground",
  medium: "text-cyan-400",
  high: "text-amber-400",
  critical: "text-red-400",
};

const priorityGlow: Record<string, "cyan" | "green" | "purple"> = {
  low: "cyan",
  medium: "cyan",
  high: "purple",
  critical: "purple",
};

const statusColors: Record<string, string> = {
  backlog: "text-muted-foreground",
  todo: "text-cyan-400",
  "in-progress": "text-amber-400",
  review: "text-purple-400",
  done: "text-emerald-400",
};

export function TaskCard({ task, showProject = false }: TaskCardProps) {
  const updateTask = useMutation(api.functions.tasks.update);
  const removeTask = useMutation(api.functions.tasks.remove);
  const project = useQuery(
    api.functions.projects.get,
    showProject ? { projectId: task.projectId } : "skip"
  );

  const toggleDone = async () => {
    try {
      await updateTask({
        taskId: task._id,
        status: task.status === "done" ? "todo" : "done",
      });
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      await removeTask({ taskId: task._id });
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  return (
    <GlowCard glowColor={priorityGlow[task.priority]} className="p-4">
      <div className="flex items-start gap-3">
        <button
          onClick={toggleDone}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all duration-200",
            task.status === "done"
              ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400"
              : "border-cyan-500/30 hover:border-cyan-500/50"
          )}
        >
          {task.status === "done" && <span className="text-xs">&#10003;</span>}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "font-medium",
                task.status === "done" && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </p>
            <button
              onClick={handleDelete}
              className="shrink-0 text-muted-foreground hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          {task.description && (
            <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-wider",
                priorityColors[task.priority]
              )}
            >
              {task.priority}
            </span>
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-wider",
                statusColors[task.status]
              )}
            >
              {task.status}
            </span>
            {showProject && project && (
              <span className="font-mono text-[10px] text-muted-foreground">
                {project.name}
              </span>
            )}
            {task.dueDate && (
              <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </GlowCard>
  );
}
