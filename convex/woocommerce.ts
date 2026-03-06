import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { action } from "./_generated/server";

export const saveCredentials = mutation({
  args: {
    url: v.string(),
    key: v.string(),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const existing = await ctx.db
      .query("clients")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        woocommerceUrl: args.url,
        woocommerceKey: args.key,
        woocommerceSecret: args.secret,
      });
      return existing._id;
    }

    const id = await ctx.db.insert("clients", {
      name: identity.name ?? "Anonymous",
      clerkId: identity.subject,
      email: identity.email!,
      plan: "free",
      woocommerceUrl: args.url,
      woocommerceKey: args.key,
      woocommerceSecret: args.secret,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const validateCredentials = action({
  args: {
    url: v.string(),
    key: v.string(),
    secret: v.string(),
  },
  handler: async (_ctx, args) => {
    const ensureHttps = (u: string) => (u.startsWith("http") ? u : `https://${u}`);
    const base = ensureHttps(args.url).replace(/\/$/, "");
    const params = new URLSearchParams();
    params.set("per_page", "1");
    const url = `${base}/wp-json/wc/v3/products?${params.toString()}`;
    const auth = Buffer.from(`${args.key}:${args.secret}`).toString("base64");
    let res = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    });
    if (!res.ok && (res.status === 401 || res.status === 403)) {
      const qp = new URLSearchParams(params);
      qp.set("consumer_key", args.key);
      qp.set("consumer_secret", args.secret);
      const altUrl = `${base}/wp-json/wc/v3/products?${qp.toString()}`;
      res = await fetch(altUrl, { headers: { Accept: "application/json" } });
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, status: res.status, message: text.slice(0, 300) };
    }
    return { ok: true };
  },
});
