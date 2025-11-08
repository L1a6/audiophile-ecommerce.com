'use node';

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import nodemailer from "nodemailer";

// Interfaces 
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

// Email Template
function generateEmailTemplate(data: EmailData): string {
  const formatPrice = (price: number) => `$${price.toLocaleString()}`;

  const getAbsoluteImageUrl = (imagePath: string) => {
  
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };
  
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 20px 0; border-bottom: 1px solid #E5E5E5;">
        <table cellpadding="0" cellspacing="0" style="width: 100%;">
          <tr>
            <td style="width: 80px; padding-right: 20px; vertical-align: top;">
              <img src="${getAbsoluteImageUrl(item.image)}" alt="${item.name}" style="width: 64px; height: 64px; border-radius: 12px; display: block; object-fit: cover; border: 1px solid #F1F1F1;" />
            </td>
            <td style="vertical-align: middle;">
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 16px; color: #191919; line-height: 1.4;">${item.shortName}</p>
              <p style="margin: 6px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 600; font-size: 15px; color: #999999;">${formatPrice(item.price)}</p>
            </td>
            <td style="text-align: right; vertical-align: middle; padding-left: 20px;">
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 16px; color: #666666;">x${item.quantity}</p>
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
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Order Confirmation - Audiophile</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #FAFAFA;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FAFAFA; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
            
            <!-- Header with Gradient -->
            <tr>
              <td style="background: linear-gradient(135deg, #D87D4A 0%, #CD6533 100%); padding: 48px 40px; text-align: center;">
                <h1 style="margin: 0 0 12px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 800; font-size: 32px; color: #FFFFFF; letter-spacing: 1.5px; text-transform: uppercase;">audiophile</h1>
                <p style="margin: 0; font-size: 15px; color: rgba(255, 255, 255, 0.9); font-weight: 500;">Premium Audio Equipment</p>
              </td>
            </tr>

            <!-- Success Badge -->
            <tr>
              <td style="padding: 48px 40px 32px 40px; text-align: center;">
                <div style="display: inline-block; background: linear-gradient(135deg, #10B981 0%, #059669 100%); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h2 style="margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 800; font-size: 32px; color: #191919; letter-spacing: 0.5px;">Order Confirmed!</h2>
                <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 17px; line-height: 1.6; color: #666666;">Hi <strong>${data.customerName}</strong>, thank you for your purchase. Your order has been confirmed and will be shipped soon.</p>
              </td>
            </tr>

            <!-- Order Number Badge -->
            <tr>
              <td style="padding: 0 40px 32px 40px;">
                <table cellpadding="0" cellspacing="0" style="width: 100%; background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%); border-radius: 12px; padding: 24px; border: 2px solid #E5E7EB;">
                  <tr>
                    <td style="text-align: center;">
                      <p style="margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 1.2px;">Order Number</p>
                      <p style="margin: 0; font-family: 'Courier New', monospace; font-weight: 700; font-size: 20px; color: #D87D4A;">${data.orderNumber}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Items Section Header -->
            <tr>
              <td style="padding: 0 40px 16px 40px;">
                <h3 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 20px; color: #191919;">Order Items</h3>
              </td>
            </tr>

            <!-- Items List -->
            <tr>
              <td style="padding: 0 40px;">
                <table cellpadding="0" cellspacing="0" style="width: 100%;">
                  ${itemsHtml}
                </table>
              </td>
            </tr>

            <!-- Order Summary -->
            <tr>
              <td style="padding: 32px 40px;">
                <table cellpadding="0" cellspacing="0" style="width: 100%; background-color: #F9FAFB; border-radius: 12px; padding: 24px;">
                  <tr>
                    <td style="padding: 8px 0;">
                      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 15px; color: #666666; font-weight: 500;">Subtotal</p>
                    </td>
                    <td style="text-align: right; padding: 8px 0;">
                      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 17px; color: #191919;">${formatPrice(data.subtotal)}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 15px; color: #666666; font-weight: 500;">Shipping</p>
                    </td>
                    <td style="text-align: right; padding: 8px 0;">
                      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 17px; color: #191919;">${formatPrice(data.shipping)}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 15px; color: #666666; font-weight: 500;">VAT (Included)</p>
                    </td>
                    <td style="text-align: right; padding: 8px 0;">
                      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 17px; color: #191919;">${formatPrice(data.vat)}</p>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding: 16px 0 8px 0;">
                      <div style="height: 2px; background: linear-gradient(90deg, #D87D4A 0%, #CD6533 100%);"></div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; color: #191919; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Grand Total</p>
                    </td>
                    <td style="text-align: right; padding: 8px 0;">
                      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 800; font-size: 24px; color: #D87D4A;">${formatPrice(data.grandTotal)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Shipping Address -->
            <tr>
              <td style="padding: 0 40px 40px 40px;">
                <table cellpadding="0" cellspacing="0" style="width: 100%; background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border-radius: 12px; padding: 24px; border: 2px solid #C7D2FE;">
                  <tr>
                    <td>
                      <p style="margin: 0 0 12px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 14px; color: #4338CA; text-transform: uppercase; letter-spacing: 1px;">
                        📦 Shipping Address
                      </p>
                      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.7; color: #1E1B4B; font-weight: 500;">
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
              <td style="background-color: #F9FAFB; padding: 40px; text-align: center; border-top: 1px solid #E5E7EB;">
                <p style="margin: 0 0 12px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 15px; color: #666666; line-height: 1.6;">
                  Thank you for choosing <strong style="color: #D87D4A;">Audiophile</strong>.<br/>
                  Questions? Contact us at <a href="mailto:support@audiophile.com" style="color: #D87D4A; text-decoration: none; font-weight: 600;">support@audiophile.com</a>
                </p>
                <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #E5E7EB;">
                  <p style="margin: 0; font-size: 13px; color: #999999;">
                    © ${new Date().getFullYear()} Audiophile. All rights reserved.
                  </p>
                </div>
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


// Internal Action for Sending Email 
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
    console.log("📧 Starting email send process...");
    console.log("📧 Recipient:", args.customerEmail);
    console.log("📧 Order:", args.orderNumber);

    try {
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      console.log("🔧 SMTP Config:");
      console.log("  Host:", smtpHost);
      console.log("  Port:", smtpPort);
      console.log("  User:", smtpUser);
      console.log("  Pass:", smtpPass ? " Set" : " Missing");

      if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
        throw new Error("SMTP credentials not configured in Convex dashboard");
      }

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      console.log(" Transporter created");

      await transporter.verify();
      console.log(" SMTP connection verified");

      const html = generateEmailTemplate(args);
      console.log(" Email template generated");

      const info = await transporter.sendMail({
        from: `Audiophile <${smtpUser}>`,
        to: args.customerEmail,
        subject: ` Order Confirmed - ${args.orderNumber}`,
        html,
      });

      console.log(" Email sent successfully!");
      console.log("  Message ID:", info.messageId);

      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error(" Error sending email:");
      console.error("  Message:", error.message);
      console.error("  Stack:", error.stack);
      
      return { 
        success: false, 
        error: error.message,
        details: error.toString()
      };
    }
  },
});