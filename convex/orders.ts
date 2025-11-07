
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

// ------------------ Helper Functions ------------------

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// ------------------ Mutations ------------------

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    try {
      // Generate unique order number
      const orderNumber = generateOrderNumber();

      // Create order in database
      const orderId = await ctx.db.insert("orders", {
        orderNumber,
        customerName: args.customerName,
        customerEmail: args.customerEmail,
        customerPhone: args.customerPhone,
        shippingAddress: args.shippingAddress,
        paymentMethod: args.paymentMethod,
        items: args.items,
        subtotal: args.subtotal,
        shipping: args.shipping,
        vat: args.vat,
        grandTotal: args.grandTotal,
        status: "pending",
        createdAt: Date.now(),
      });

      // Schedule email to be sent immediately (runAfter 0 means as soon as possible)
      await ctx.scheduler.runAfter(
        0,
        internal.actions.emails.sendOrderConfirmationEmail,
        {
          orderNumber,
          customerName: args.customerName,
          customerEmail: args.customerEmail,
          items: args.items,
          subtotal: args.subtotal,
          shipping: args.shipping,
          vat: args.vat,
          grandTotal: args.grandTotal,
          shippingAddress: args.shippingAddress,
        }
      );

      console.log(`✅ Order created: ${orderNumber} (ID: ${orderId})`);

      return { orderId, orderNumber };
    } catch (error) {
      console.error("❌ Error creating order:", error);
      throw new Error("Failed to create order");
    }
  },
});

export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.patch(args.orderId, {
        status: args.status,
      });

      console.log(`✅ Order ${args.orderId} status updated to: ${args.status}`);
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      throw new Error("Failed to update order status");
    }
  },
});

// ------------------ Queries ------------------

export const getByOrderNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    try {
      const order = await ctx.db
        .query("orders")
        .withIndex("by_order_number", (q) => q.eq("orderNumber", args.orderNumber))
        .first();

      return order;
    } catch (error) {
      console.error("❌ Error fetching order by order number:", error);
      return null;
    }
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    try {
      const orders = await ctx.db
        .query("orders")
        .withIndex("by_email", (q) => q.eq("customerEmail", args.email))
        .order("desc")
        .collect();

      return orders;
    } catch (error) {
      console.error("❌ Error fetching orders by email:", error);
      return [];
    }
  },
});

export const getAll = query({
  handler: async (ctx) => {
    try {
      const orders = await ctx.db
        .query("orders")
        .order("desc")
        .collect();

      return orders;
    } catch (error) {
      console.error("❌ Error fetching all orders:", error);
      return [];
    }
  },
});

export const getById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    try {
      const order = await ctx.db.get(args.orderId);
      return order;
    } catch (error) {
      console.error("❌ Error fetching order by ID:", error);
      return null;
    }
  },
});
