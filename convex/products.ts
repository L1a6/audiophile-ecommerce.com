import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const products = await ctx.db.query("products").collect();
    return products.find((p) => p.id === args.id);
  },
});

export const create = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    shortName: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    image: v.string(),
    gallery: v.array(v.string()),
    features: v.string(),
    includes: v.array(
      v.object({
        quantity: v.number(),
        item: v.string(),
      })
    ),
    new: v.boolean(),
  },
  handler: async (ctx, args) => {
    const productId = await ctx.db.insert("products", args);
    return productId;
  },
});