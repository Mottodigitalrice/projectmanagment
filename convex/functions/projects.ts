import { v } from "convex/values";
import { query, mutation } from "../_generated/server";

// List all projects for a user
export const list = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get a single project by ID
export const get = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.projectId);
  },
});

// Create a new project
export const create = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    accentColor: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("projects", {
      userId: args.userId,
      name: args.name,
      description: args.description,
      status: "active",
      accentColor: args.accentColor,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a project
export const update = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("on-hold"),
        v.literal("completed"),
        v.literal("archived")
      )
    ),
    accentColor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { projectId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, val]) => val !== undefined)
    );
    await ctx.db.patch(projectId, {
      ...filtered,
      updatedAt: Date.now(),
    });
  },
});

// Delete a project (and its tasks/resources)
export const remove = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    // Delete associated tasks
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }
    // Delete associated resources (and their storage files)
    const resources = await ctx.db
      .query("resources")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
    for (const resource of resources) {
      await ctx.storage.delete(resource.fileId);
      await ctx.db.delete(resource._id);
    }
    // Delete the project
    await ctx.db.delete(args.projectId);
  },
});

// Get project stats (task counts by status)
export const getStats = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
    const resources = await ctx.db
      .query("resources")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === "done").length,
      inProgressTasks: tasks.filter((t) => t.status === "in-progress").length,
      totalResources: resources.length,
    };
  },
});
