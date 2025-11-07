import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  orders: defineTable({
    orderNumber: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    shippingAddress: v.object({
      address: v.string(),
      zipCode: v.string(),
      city: v.string(),
      country: v.string(),
    }),
    paymentMethod: v.union(v.literal("e-money"), v.literal("cash")),
    items: v.array(
      v.object({
        productId: v.string(),
        name: v.string(),
        shortName: v.string(),
        price: v.number(),
        quantity: v.number(),
        image: v.string(),
      })
    ),
    subtotal: v.number(),
    shipping: v.number(),
    vat: v.number(),
    grandTotal: v.number(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_email", ["customerEmail"])
    .index("by_order_number", ["orderNumber"])
    .index("by_created_at", ["createdAt"]),

  products: defineTable({
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
  }).index("by_category", ["category"]),
});