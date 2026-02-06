"use client";

import { use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { GlowCard } from "@/components/shared/glow-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { TaskForm } from "@/components/features/tasks";
import { ResourceUpload } from "@/components/features/resources";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Id } from "../../../../../convex/_generated/dataModel";

const statusVariantMap = {
  active: "success" as const,
  "on-hold": "warning" as const,
  completed: "info" as const,
  archived: "default" as const,
};

const projectStatuses = ["active", "on-hold", "completed", "archived"] as const;

function GlowSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn(
        "bg-cyan-500/5 border border-cyan-500/10",
        className
      )}
    />
  );
}

function ResourceItem({
  resource,
  glowColor,
}: {
  resource: {
    _id: Id<"resources">;
    name: string;
    fileId: Id<"_storage">;
    fileType: string;
    fileSize: number;
  };
  glowColor: "cyan" | "green" | "purple";
}) {
  const fileUrl = useQuery(api.functions.resources.getUrl, { fileId: resource.fileId });
  const removeResource = useMutation(api.functions.resources.remove);

  return (
    <GlowCard glowColor={glowColor} className="p-4">
      <div className="flex items-start justify-between">
        <p className="font-mono text-sm font-medium truncate flex-1">
          {resource.name}
        </p>
        <div className="ml-2 flex shrink-0 items-center gap-1">
          {fileUrl && (
            <button
              onClick={() => window.open(fileUrl, "_blank")}
              className="text-muted-foreground hover:text-cyan-400 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={async () => {
              try {
                await removeResource({ resourceId: resource._id });
                toast.success("Resource deleted");
              } catch {
                toast.error("Failed to delete resource");
              }
            }}
            className="text-muted-foreground hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
        {resource.fileType} &middot; {(resource.fileSize / 1024).toFixed(1)}KB
      </p>
    </GlowCard>
  );
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const convexUser = useCurrentUser();
  const project = useQuery(api.functions.projects.get, {
    projectId: id as Id<"projects">,
  });
  const stats = useQuery(
    api.functions.projects.getStats,
    project ? { projectId: project._id } : "skip"
  );
  const tasks = useQuery(
    api.functions.tasks.listByProject,
    project ? { projectId: project._id } : "skip"
  );
  const resources = useQuery(
    api.functions.resources.listByProject,
    project ? { projectId: project._id } : "skip"
  );
  const removeProject = useMutation(api.functions.projects.remove);
  const updateProject = useMutation(api.functions.projects.update);
  const updateTask = useMutation(api.functions.tasks.update);
  const removeTask = useMutation(api.functions.tasks.remove);

  if (project === undefined) {
    return (
      <div className="space-y-6">
        <GlowSkeleton className="h-8 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <GlowSkeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <GlowSkeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 font-mono text-4xl text-cyan-500/30">404</div>
        <h2 className="font-mono text-lg text-foreground">Project not found</h2>
        <p className="mt-1 font-mono text-sm text-muted-foreground">
          This project may have been deleted or doesn&apos;t exist.
        </p>
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mt-4 text-cyan-400 hover:text-cyan-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  const glowColor =
    project.accentColor === "green"
      ? "green"
      : project.accentColor === "purple"
        ? "purple"
        : "cyan";

  const handleDelete = async () => {
    try {
      await removeProject({ projectId: project._id });
      toast.success("Project deleted");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleStatusChange = async (newStatus: typeof projectStatuses[number]) => {
    try {
      await updateProject({ projectId: project._id, status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const statusColors: Record<string, string> = {
    backlog: "text-muted-foreground",
    todo: "text-cyan-400",
    "in-progress": "text-amber-400",
    review: "text-purple-400",
    done: "text-emerald-400",
  };

  const priorityColors: Record<string, string> = {
    low: "text-muted-foreground",
    medium: "text-cyan-400",
    high: "text-amber-400",
    critical: "text-red-400",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard")}
          className="text-muted-foreground hover:text-cyan-400"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">
            <span className="text-cyan-400">&gt;</span> {project.name}
          </h1>
          {project.description && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge
            status={project.status}
            variant={statusVariantMap[project.status]}
          />
          <select
            value={project.status}
            onChange={(e) => handleStatusChange(e.target.value as typeof projectStatuses[number])}
            className="rounded-md border border-cyan-500/20 bg-background px-2 py-1 font-mono text-xs text-foreground focus:border-cyan-500/40 focus:outline-none"
          >
            {projectStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="text-muted-foreground hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Tasks", value: stats?.totalTasks ?? 0 },
          { label: "In Progress", value: stats?.inProgressTasks ?? 0 },
          { label: "Completed", value: stats?.completedTasks ?? 0 },
          { label: "Resources", value: stats?.totalResources ?? 0 },
        ].map((stat) => (
          <GlowCard key={stat.label} glowColor={glowColor} className="p-4">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-foreground">
              {stat.value}
            </p>
          </GlowCard>
        ))}
      </div>

      {/* Tasks Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-lg font-semibold text-foreground">
            <span className="text-cyan-400">//</span> Tasks
          </h2>
          {convexUser && (
            <TaskForm userId={convexUser._id} defaultProjectId={project._id} />
          )}
        </div>
        {tasks === undefined ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <GlowSkeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <GlowCard glowColor={glowColor} className="py-8 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              No tasks yet — click &quot;New Task&quot; above to add one
            </p>
          </GlowCard>
        ) : (
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <div
                key={task._id}
                style={{ animationDelay: `${index * 60}ms` }}
                className="animate-fade-slide-in opacity-0"
              >
                <GlowCard glowColor={glowColor} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={async () => {
                        try {
                          await updateTask({
                            taskId: task._id,
                            status: task.status === "done" ? "todo" : "done",
                          });
                        } catch {
                          toast.error("Failed to update task");
                        }
                      }}
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all duration-200",
                        task.status === "done"
                          ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400"
                          : "border-cyan-500/30 hover:border-cyan-500/50"
                      )}
                    >
                      {task.status === "done" && (
                        <span className="text-xs">&#10003;</span>
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "font-medium truncate",
                          task.status === "done" && "line-through text-muted-foreground"
                        )}
                      >
                        {task.title}
                      </p>
                    </div>
                    <span className={cn("font-mono text-xs uppercase", priorityColors[task.priority])}>
                      {task.priority}
                    </span>
                    <span className={cn("font-mono text-xs uppercase", statusColors[task.status])}>
                      {task.status}
                    </span>
                    <button
                      onClick={async () => {
                        try {
                          await removeTask({ taskId: task._id });
                          toast.success("Task deleted");
                        } catch {
                          toast.error("Failed to delete task");
                        }
                      }}
                      className="shrink-0 text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </GlowCard>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resources Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-lg font-semibold text-foreground">
            <span className="text-cyan-400">//</span> Resources
          </h2>
          {convexUser && (
            <ResourceUpload userId={convexUser._id} defaultProjectId={project._id} />
          )}
        </div>
        {resources === undefined ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <GlowSkeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <GlowCard glowColor={glowColor} className="py-8 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              No resources yet — click &quot;Upload File&quot; above to add one
            </p>
          </GlowCard>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {resources.map((resource, index) => (
              <div
                key={resource._id}
                style={{ animationDelay: `${index * 60}ms` }}
                className="animate-fade-slide-in opacity-0"
              >
                <ResourceItem resource={resource} glowColor={glowColor} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
