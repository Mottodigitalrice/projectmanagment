import { v } from "convex/values";
import { query, mutation } from "../_generated/server";

// List resources for a project
export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resources")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();
  },
});

// List ALL resources for a user
export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resources")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Generate upload URL
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save resource after upload
export const create = mutation({
  args: {
    userId: v.id("users"),
    projectId: v.id("projects"),
    name: v.string(),
    fileId: v.id("_storage"),
    fileType: v.string(),
    fileSize: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("resources", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get download URL for a resource
export const getUrl = query({
  args: { fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.fileId);
  },
});

// Delete a resource
export const remove = mutation({
  args: { resourceId: v.id("resources") },
  handler: async (ctx, args) => {
    const resource = await ctx.db.get(args.resourceId);
    if (resource) {
      await ctx.storage.delete(resource.fileId);
      await ctx.db.delete(args.resourceId);
    }
  },
});
