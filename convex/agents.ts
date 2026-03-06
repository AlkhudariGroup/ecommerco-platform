import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const setSystemRole = mutation({
  args: {
    name: v.optional(v.string()),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    const client = await ctx.db
      .query("clients")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!client) {
      throw new Error("Client not found");
    }
    const existing = await ctx.db
      .query("agents")
      .withIndex("by_client_id", (q) => q.eq("clientId", client._id))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name ?? existing.name,
        config: { ...(existing.config ?? {}), systemRole: args.role },
      });
      return existing._id;
    }
    const id = await ctx.db.insert("agents", {
      clientId: client._id,
      name: args.name ?? "SalParts AI Assistant",
      personality: "professional",
      isActive: true,
      config: { systemRole: args.role },
    });
    return id;
  },
});

