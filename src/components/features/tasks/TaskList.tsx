"use client";

import { TaskCard } from "./TaskCard";
import type { Id } from "../../../../convex/_generated/dataModel";

interface Task {
  _id: Id<"tasks">;
  title: string;
  description?: string;
  status: "backlog" | "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  projectId: Id<"projects">;
  userId: Id<"users">;
  dueDate?: number;
  createdAt: number;
  updatedAt: number;
}

interface TaskListProps {
  tasks: Task[];
  showProject?: boolean;
}

export function TaskList({ tasks, showProject = false }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10">
          <span className="font-mono text-2xl text-cyan-400">[]</span>
        </div>
        <h3 className="font-mono text-lg text-foreground">No tasks found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task, index) => (
        <div
          key={task._id}
          style={{ animationDelay: `${index * 60}ms` }}
          className="animate-fade-slide-in opacity-0"
        >
          <TaskCard task={task} showProject={showProject} />
        </div>
      ))}
    </div>
  );
}
