"use client";

import { ResourceCard } from "./ResourceCard";
import type { Id } from "../../../../convex/_generated/dataModel";

interface Resource {
  _id: Id<"resources">;
  name: string;
  fileId: Id<"_storage">;
  fileType: string;
  fileSize: number;
  projectId: Id<"projects">;
  userId: Id<"users">;
  createdAt: number;
}

interface ResourceGridProps {
  resources: Resource[];
  showProject?: boolean;
}

export function ResourceGrid({ resources, showProject = false }: ResourceGridProps) {
  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10">
          <span className="font-mono text-2xl text-cyan-400">0</span>
        </div>
        <h3 className="font-mono text-lg text-foreground">No resources found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload files to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {resources.map((resource, index) => (
        <div
          key={resource._id}
          style={{ animationDelay: `${index * 60}ms` }}
          className="animate-fade-slide-in opacity-0"
        >
          <ResourceCard resource={resource} showProject={showProject} />
        </div>
      ))}
    </div>
  );
}
