"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { GlowCard } from "@/components/shared/glow-card";
import { Trash2, Download, FileText, Image, FileArchive, File } from "lucide-react";
import { toast } from "sonner";
import type { Id } from "../../../../convex/_generated/dataModel";

interface Resource {
  _id: Id<"resources">;
  name: string;
  fileId: Id<"_storage">;
  fileType: string;
  fileSize: number;
  projectId: Id<"projects">;
  createdAt: number;
}

interface ResourceCardProps {
  resource: Resource;
  showProject?: boolean;
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith("image/")) return Image;
  if (fileType.includes("pdf") || fileType.includes("document")) return FileText;
  if (fileType.includes("zip") || fileType.includes("archive")) return FileArchive;
  return File;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function ResourceCard({ resource, showProject = false }: ResourceCardProps) {
  const fileUrl = useQuery(api.functions.resources.getUrl, { fileId: resource.fileId });
  const project = useQuery(
    api.functions.projects.get,
    showProject ? { projectId: resource.projectId } : "skip"
  );
  const removeResource = useMutation(api.functions.resources.remove);

  const Icon = getFileIcon(resource.fileType);

  const handleDelete = async () => {
    try {
      await removeResource({ resourceId: resource._id });
      toast.success("Resource deleted");
    } catch {
      toast.error("Failed to delete resource");
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <GlowCard glowColor="cyan" className="p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-sm font-medium truncate">{resource.name}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase text-muted-foreground">
              {formatFileSize(resource.fileSize)}
            </span>
            {showProject && project && (
              <>
                <span className="text-muted-foreground/40">&middot;</span>
                <span className="font-mono text-[10px] text-muted-foreground truncate">
                  {project.name}
                </span>
              </>
            )}
            <span className="text-muted-foreground/40">&middot;</span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {new Date(resource.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={handleDownload}
            className="rounded p-1 text-muted-foreground hover:text-cyan-400 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="rounded p-1 text-muted-foreground hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </GlowCard>
  );
}
