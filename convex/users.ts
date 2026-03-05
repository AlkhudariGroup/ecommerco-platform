
import { mutation, query } from "./_generated/server";

export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this user or need to create a new one.
    const user = await ctx.db
      .query("clients")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user !== null) {
      // If we've seen this user before but maybe some info has changed, patch the user.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }

    // If it's a new user, create a new 'Client' record for them.
    return await ctx.db.insert("clients", {
      name: identity.name ?? "Anonymous",
      clerkId: identity.subject,
      email: identity.email!,
      plan: "free",
      createdAt: Date.now(),
    });
  },
});
