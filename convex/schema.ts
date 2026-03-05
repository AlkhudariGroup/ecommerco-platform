
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1) Clients (Tenants)
  clients: defineTable({
    name: v.string(),
    clerkId: v.string(), // Organization ID or User ID from Clerk
    email: v.string(),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
    woocommerceUrl: v.optional(v.string()),
    woocommerceKey: v.optional(v.string()),
    woocommerceSecret: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // 2) AI Agents
  agents: defineTable({
    clientId: v.id("clients"),
    name: v.string(),
    personality: v.string(), // e.g., "friendly", "formal"
    voiceId: v.optional(v.string()), // ElevenLabs voice ID
    isActive: v.boolean(),
    config: v.any(), // Flexible config for future tools
  }).index("by_client_id", ["clientId"]),

  // 3) Conversations
  conversations: defineTable({
    agentId: v.id("agents"),
    customerId: v.optional(v.string()), // External customer ID if known
    startedAt: v.number(),
    status: v.union(v.literal("active"), v.literal("closed"), v.literal("escalated")),
  }).index("by_agent_id", ["agentId"]),

  // 4) Messages
  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
    timestamp: v.number(),
  }).index("by_conversation_id", ["conversationId"]),

  // 5) Products (Cached/Synced from WooCommerce)
  products: defineTable({
    clientId: v.id("clients"),
    externalId: v.string(), // WooCommerce Product ID
    name: v.string(),
    price: v.number(),
    description: v.optional(v.string()),
    inStock: v.boolean(),
    embedding: v.optional(v.array(v.number())), // For vector search later
  }).index("by_client_id", ["clientId"]),
});
