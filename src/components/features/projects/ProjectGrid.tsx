"use client";

import { useRouter } from "next/navigation";
import { ProjectCard } from "./ProjectCard";
import type { Id } from "../../../../convex/_generated/dataModel";

interface Project {
  _id: Id<"projects">;
  name: string;
  description?: string;
  status: "active" | "on-hold" | "completed" | "archived";
  accentColor: string;
  createdAt: number;
  updatedAt: number;
  userId: Id<"users">;
}

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const router = useRouter();

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10">
          <span className="text-3xl">+</span>
        </div>
        <h3 className="font-mono text-lg text-foreground">No projects yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first project to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <div
          key={project._id}
          style={{ animationDelay: `${index * 80}ms` }}
          className="animate-fade-slide-in opacity-0"
        >
          <ProjectCard
            project={project}
            onClick={() => router.push(`/dashboard/projects/${project._id}`)}
          />
        </div>
      ))}
    </div>
  );
}
