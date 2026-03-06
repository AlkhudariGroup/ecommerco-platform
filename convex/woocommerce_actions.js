import { action } from "./_generated/server";
import { v } from "convex/values";

export const searchProducts = action({
  args: {
    query: v.optional(v.string()),
    sku: v.optional(v.string()),
    perPage: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { api } = await import("./_generated/api");
    const client = await ctx.runQuery(api.clients.getCurrent, {});
    if (!client || !client.woocommerceUrl || !client.woocommerceKey || !client.woocommerceSecret) {
      throw new Error("WooCommerce not configured");
    }
    const ensureHttps = (u) => (u.startsWith("http") ? u : `https://${u}`);
    const base = ensureHttps(client.woocommerceUrl).replace(/\/$/, "");
    const params = new URLSearchParams();
    params.set("status", "publish");
    params.set("per_page", String(args.perPage ?? 10));
    if (args.query) params.set("search", args.query);
    if (args.sku) params.set("sku", args.sku);
    const url = `${base}/wp-json/wc/v3/products?${params.toString()}`;
    const auth = Buffer.from(`${client.woocommerceKey}:${client.woocommerceSecret}`).toString("base64");
    let res = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    });
    if (!res.ok && (res.status === 401 || res.status === 403)) {
      const qp = new URLSearchParams(params);
      qp.set("consumer_key", client.woocommerceKey);
      qp.set("consumer_secret", client.woocommerceSecret);
      const altUrl = `${base}/wp-json/wc/v3/products?${qp.toString()}`;
      res = await fetch(altUrl, { headers: { Accept: "application/json" } });
    }
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`WooCommerce error ${res.status} ${t}`);
    }
    const data = await res.json();
    return (Array.isArray(data) ? data : []).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      stock_status: p.stock_status,
      stock_quantity: p.stock_quantity ?? null,
      sku: p.sku ?? "",
      permalink: p.permalink ?? "",
      short_description: p.short_description ?? "",
    }));
  },
});

