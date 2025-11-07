
'use node';

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import nodemailer from "nodemailer";

interface OrderItem {
  productId: string;
  name: string;
  shortName: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingAddress {
  address: string;
  zipCode: string;
  city: string;
  country: string;
}

interface EmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  vat: number;
  grandTotal: number;
  shippingAddress: ShippingAddress;
}

function generateEmailTemplate(data: EmailData): string {
  const formatPrice = (price: number) => `$${price.toLocaleString()}`;
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #F1F1F1;">
        <table cellpadding="0" cellspacing="0" style="width: 100%;">
          <tr>
            <td style="width: 80px; padding-right: 16px;">
              <img src="${item.image}" alt="${item.name}" style="width: 64px; height: 64px; border-radius: 8px; display: block;" />
            </td>
            <td style="vertical-align: middle;">
              <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-weight: 700; font-size: 15px; color: #000000;">${item.shortName}</p>
              <p style="margin: 4px 0 0 0; font-family: 'Manrope', Arial, sans-serif; font-weight: 700; font-size: 14px; color: #000000; opacity: 0.5;">${formatPrice(item.price)}</p>
            </td>
            <td style="text-align: right; vertical-align: middle; width: 60px;">
              <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-weight: 700; font-size: 15px; color: #000000; opacity: 0.5;">x${item.quantity}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Audiophile</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap" rel="stylesheet">
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Manrope', Arial, sans-serif; background-color: #F2F2F2;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F2F2F2; padding: 40px 0;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #FFFFFF; border-radius: 8px; overflow: hidden;">
            
            <!-- Header with Logo -->
            <tr>
              <td style="background-color: #191919; padding: 32px; text-align: center;">
                <h1 style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-weight: 700; font-size: 24px; color: #FFFFFF; letter-spacing: 2px;">audiophile</h1>
              </td>
            </tr>

            <!-- Success Icon -->
            <tr>
              <td style="padding: 48px 48px 24px 48px; text-align: center;">
                <div style="width: 64px; height: 64px; background-color: #D87D4A; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </td>
            </tr>

            <!-- Thank You Message -->
            <tr>
              <td style="padding: 0 48px 24px 48px; text-align: center;">
                <h2 style="margin: 0 0 16px 0; font-family: 'Manrope', Arial, sans-serif; font-weight: 700; font-size: 28px; color: #000000; text-transform: uppercase; letter-spacing: 1px;">Thank You For Your Order!</h2>
                <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-size: 15px; line-height: 25px; color: #000000; opacity: 0.5;">Hi ${data.customerName}, your order has been confirmed and will be shipped soon.</p>
              </td>
            </tr>

            <!-- Order Details -->
            <tr>
              <td style="padding: 0 48px 24px 48px;">
                <table cellpadding="0" cellspacing="0" style="width: 100%; background-color: #F1F1F1; border-radius: 8px; padding: 24px;">
                  <tr>
                    <td>
                      <p style="margin: 0 0 8px 0; font-family: 'Manrope', Arial, sans-serif; font-weight: 700; font-size: 13px; color: #000000; opacity: 0.5;">ORDER NUMBER</p>
                      <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-weight: 700; font-size: 15px; color: #000000;">${data.orderNumber}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Items -->
            <tr>
              <td style="padding: 0 48px;">
                <table cellpadding="0" cellspacing="0" style="width: 100%;">
                  ${itemsHtml}
                </table>
              </td>
            </tr>

            <!-- Totals -->
            <tr>
              <td style="padding: 24px 48px 48px 48px;">
                <table cellpadding="0" cellspacing="0" style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0;">
                      <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-size: 15px; color: #000000; opacity: 0.5;">TOTAL</p>
                    </td>
                    <td style="text-align: right; padding: 8px 0;">
                      <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-weight: 700; font-size: 18px; color: #000000;">${formatPrice(data.subtotal)}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-size: 15px; color: #000000; opacity: 0.5;">SHIPPING</p>
                    </td>
                    <td style="text-align: right; padding: 8px 0;">
                      <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-weight: 700; font-size: 18px; color: #000000;">${formatPrice(data.shipping)}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-size: 15px; color: #000000; opacity: 0.5;">VAT (INCLUDED)</p>
                    </td>
                    <td style="text-align: right; padding: 8px 0;">
                      <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-weight: 700; font-size: 18px; color: #000000;">${formatPrice(data.vat)}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 0 0 0; border-top: 1px solid #F1F1F1;">
                      <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-size: 15px; color: #000000; opacity: 0.5;">GRAND TOTAL</p>
                    </td>
                    <td style="text-align: right; padding: 16px 0 0 0; border-top: 1px solid #F1F1F1;">
                      <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-weight: 700; font-size: 18px; color: #D87D4A;">${formatPrice(data.grandTotal)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Shipping Address -->
            <tr>
              <td style="padding: 0 48px 48px 48px;">
                <table cellpadding="0" cellspacing="0" style="width: 100%; background-color: #F1F1F1; border-radius: 8px; padding: 24px;">
                  <tr>
                    <td>
                      <p style="margin: 0 0 8px 0; font-family: 'Manrope', Arial, sans-serif; font-weight: 700; font-size: 13px; color: #000000; opacity: 0.5;">SHIPPING ADDRESS</p>
                      <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-size: 15px; line-height: 25px; color: #000000;">
                        ${data.shippingAddress.address}<br/>
                        ${data.shippingAddress.city}, ${data.shippingAddress.zipCode}<br/>
                        ${data.shippingAddress.country}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #F1F1F1; padding: 32px; text-align: center;">
                <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-size: 13px; color: #000000; opacity: 0.5;">
                  Thank you for shopping with Audiophile. If you have any questions, please contact our support team.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

// ------------------ Internal Action for Sending Email ------------------
export const sendOrderConfirmationEmail = internalAction({
  args: {
    orderNumber: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
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
    shippingAddress: v.object({
      address: v.string(),
      zipCode: v.string(),
      city: v.string(),
      country: v.string(),
    }),
  },
  handler: async (_, args) => {
    try {
      // Create nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Generate email HTML
      const html = generateEmailTemplate(args);

      // Send email
      await transporter.sendMail({
        from: `Audiophile <${process.env.SMTP_USER}>`,
        to: args.customerEmail,
        subject: `Order Confirmation - ${args.orderNumber}`,
        html,
      });

      console.log(`✅ Order confirmation email sent to ${args.customerEmail}`);
      
      return { success: true, message: "Email sent successfully" };
    } catch (error) {
      console.error("❌ Error sending order confirmation email:", error);
      // Don't throw - we don't want email failures to break order creation
      return { success: false, message: "Failed to send email" };
    }
  },
});








