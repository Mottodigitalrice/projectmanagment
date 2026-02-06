"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Id } from "../../../../convex/_generated/dataModel";

interface TaskFormProps {
  userId: Id<"users">;
  defaultProjectId?: Id<"projects">;
}

const priorities = [
  { value: "low", label: "Low", color: "text-muted-foreground" },
  { value: "medium", label: "Medium", color: "text-cyan-400" },
  { value: "high", label: "High", color: "text-amber-400" },
  { value: "critical", label: "Critical", color: "text-red-400" },
] as const;

export function TaskForm({ userId, defaultProjectId }: TaskFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [projectId, setProjectId] = useState<string>(defaultProjectId ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const projects = useQuery(api.functions.projects.list, { userId });
  const createTask = useMutation(api.functions.tasks.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    setIsLoading(true);
    try {
      await createTask({
        userId,
        projectId: projectId as Id<"projects">,
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
      });
      toast.success("Task created");
      setTitle("");
      setDescription("");
      setPriority("medium");
      if (!defaultProjectId) setProjectId("");
      setOpen(false);
    } catch {
      toast.error("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-200">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="border-cyan-500/20 bg-card">
        <DialogHeader>
          <DialogTitle className="font-mono text-cyan-400">
            &gt; new_task
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Task Title
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="border-cyan-500/20 bg-background font-mono focus:border-cyan-500/40 focus:shadow-[0_0_10px_rgba(0,255,255,0.1)]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Description
            </Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              className="border-cyan-500/20 bg-background font-mono focus:border-cyan-500/40 focus:shadow-[0_0_10px_rgba(0,255,255,0.1)]"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Priority
            </Label>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-200",
                    priority === p.value
                      ? "border-cyan-500/40 bg-cyan-500/10"
                      : "border-border text-muted-foreground hover:border-border",
                    p.color
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading || !title.trim() || !projectId}
            className="w-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-200"
          >
            {isLoading ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
