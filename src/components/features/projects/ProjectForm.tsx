"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
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

interface ProjectFormProps {
  userId: Id<"users">;
}

const accentColors = [
  { value: "cyan", label: "Cyan", class: "bg-cyan-400" },
  { value: "green", label: "Green", class: "bg-emerald-400" },
  { value: "purple", label: "Purple", class: "bg-purple-400" },
];

export function ProjectForm({ userId }: ProjectFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [accentColor, setAccentColor] = useState("cyan");
  const [isLoading, setIsLoading] = useState(false);

  const createProject = useMutation(api.functions.projects.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await createProject({
        userId,
        name: name.trim(),
        description: description.trim() || undefined,
        accentColor,
      });
      toast.success("Project created");
      setName("");
      setDescription("");
      setAccentColor("cyan");
      setOpen(false);
    } catch {
      toast.error("Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-200">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="border-cyan-500/20 bg-card">
        <DialogHeader>
          <DialogTitle className="font-mono text-cyan-400">
            &gt; new_project
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Project Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name..."
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
              Accent Color
            </Label>
            <div className="flex gap-3">
              {accentColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setAccentColor(color.value)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-mono transition-all duration-200",
                    accentColor === color.value
                      ? "border-cyan-500/40 bg-cyan-500/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-border"
                  )}
                >
                  <span className={cn("h-3 w-3 rounded-full", color.class)} />
                  {color.label}
                </button>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="w-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-200"
          >
            {isLoading ? "Creating..." : "Initialize Project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
