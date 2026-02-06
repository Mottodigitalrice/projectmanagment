"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { GlowCard } from "@/components/shared/glow-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { FolderOpen, CheckSquare, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Id } from "../../../../convex/_generated/dataModel";

interface Project {
  _id: Id<"projects">;
  name: string;
  description?: string;
  status: "active" | "on-hold" | "completed" | "archived";
  accentColor: string;
  createdAt: number;
  updatedAt: number;
}

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const statusVariantMap = {
  active: "success" as const,
  "on-hold": "warning" as const,
  completed: "info" as const,
  archived: "default" as const,
};

const accentGlowMap: Record<string, "cyan" | "green" | "purple"> = {
  cyan: "cyan",
  green: "green",
  purple: "purple",
};

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const stats = useQuery(api.functions.projects.getStats, {
    projectId: project._id,
  });

  const glowColor = accentGlowMap[project.accentColor] ?? "cyan";

  return (
    <div onClick={onClick} className="cursor-pointer animate-fade-slide-in">
      <GlowCard glowColor={glowColor} className="group">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                glowColor === "cyan" && "bg-cyan-500/10 text-cyan-400",
                glowColor === "green" && "bg-emerald-500/10 text-emerald-400",
                glowColor === "purple" && "bg-purple-500/10 text-purple-400"
              )}
            >
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              {project.description && (
                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                  {project.description}
                </p>
              )}
            </div>
          </div>
          <StatusBadge
            status={project.status}
            variant={statusVariantMap[project.status]}
          />
        </div>

        {/* Stats row */}
        <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckSquare className="h-3.5 w-3.5" />
            <span className="font-mono">
              {stats?.completedTasks ?? 0}/{stats?.totalTasks ?? 0}
            </span>
            <span>tasks</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            <span className="font-mono">{stats?.totalResources ?? 0}</span>
            <span>files</span>
          </div>
          <div className="ml-auto font-mono text-[10px] text-muted-foreground/60">
            {new Date(project.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </GlowCard>
    </div>
  );
}
