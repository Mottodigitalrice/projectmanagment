"use client";

import { useState, useRef, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Id } from "../../../../convex/_generated/dataModel";

interface ResourceUploadProps {
  userId: Id<"users">;
  defaultProjectId?: Id<"projects">;
}

export function ResourceUpload({ userId, defaultProjectId }: ResourceUploadProps) {
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState<string>(defaultProjectId ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const projects = useQuery(api.functions.projects.list, { userId });
  const generateUploadUrl = useMutation(api.functions.resources.generateUploadUrl);
  const createResource = useMutation(api.functions.resources.create);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleUpload = async () => {
    if (!file || !projectId) return;

    setIsUploading(true);
    try {
      // Step 1: Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Upload failed");

      const { storageId } = await result.json();

      // Step 3: Save resource record
      await createResource({
        userId,
        projectId: projectId as Id<"projects">,
        name: file.name,
        fileId: storageId,
        fileType: file.type,
        fileSize: file.size,
      });

      toast.success("File uploaded");
      setFile(null);
      if (!defaultProjectId) setProjectId("");
      setOpen(false);
    } catch {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-200">
          <Plus className="h-4 w-4" />
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent className="border-cyan-500/20 bg-card">
        <DialogHeader>
          <DialogTitle className="font-mono text-cyan-400">
            &gt; upload_resource
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!defaultProjectId && (
            <div className="space-y-2">
              <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Project
              </Label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full rounded-md border border-cyan-500/20 bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                required
              >
                <option value="">Select project...</option>
                {projects?.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200",
              isDragging
                ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(0,255,255,0.15)]"
                : "border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-500/5"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center gap-3 text-center">
                <div>
                  <p className="font-mono text-sm font-medium text-foreground">
                    {file.name}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)}KB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="text-muted-foreground hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="mb-2 h-8 w-8 text-cyan-400/50" />
                <p className="font-mono text-sm text-muted-foreground">
                  Drop file here or click to browse
                </p>
              </>
            )}
          </div>

          <Button
            onClick={handleUpload}
            disabled={isUploading || !file || !projectId}
            className="w-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-200"
          >
            {isUploading ? "Uploading..." : "Upload Resource"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
