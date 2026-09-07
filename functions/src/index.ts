import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

if (!admin.apps.length) {
  admin.initializeApp();
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "jaesthetic.info@gmail.com";

// Configure SMTP transport with environment variables or fallback to test/log transport
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true";

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  // Fallback logger transporter if SMTP is not explicitly configured
  return nodemailer.createTransport({
    streamTransport: true,
    newline: "unix",
    buffer: true,
  });
}

/**
 * Firebase Cloud Function triggered by document creation in the 'orders' collection.
 * Sends automated confirmation emails to both:
 * 1. Store Admin (jaesthetic.info@gmail.com)
 * 2. Customer (order.customerInfo.email)
 */
export const onOrderCreatedSendNotification = onDocumentCreated(
  "orders/{orderDocId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log("No data associated with this event.");
      return;
    }

    const orderDocId = event.params.orderDocId;
    const order = snapshot.data();

    if (!order) {
      console.log(`Empty order document: ${orderDocId}`);
      return;
    }

    const orderId = order.orderId || orderDocId;
    const customer = order.customerInfo || {};
    const customerEmail = customer.email;
    const customerName = customer.fullName || "Valued Customer";
    const total = Number(order.total || 0);
    const subtotal = Number(order.subtotal || 0);
    const shipping = Number(order.shipping || 0);
    const paymentMethod = (order.paymentMethod || "gcash").toUpperCase();
    const trackingUrl = order.trackingUrl || `https://tappyreview.ph/?track=${orderId}`;

    const itemsSummary = Array.isArray(order.items)
      ? order.items
          .map(
            (item: any, i: number) =>
              `${i + 1}. ${item.productName || item.product?.name || "TAPPY NFC Unit"} (Qty: ${item.quantity || 1}) - ₱${Number(item.price || 0).toLocaleString()}${
                item.businessName ? ` [Business: ${item.businessName}]` : ""
              }`
          )
          .join("\n")
      : "No items specified";

    const transporter = createTransporter();
    const sender = process.env.SMTP_FROM || `"TAPPY NFC Store" <no-reply@tapreview.ph>`;

    // ========================================================
    // 1. Send Automated Confirmation to Admin (jaesthetic.info@gmail.com)
    // ========================================================
    const adminSubject = `🚨 [NEW ORDER #${orderId}] ₱${total.toLocaleString()} - ${customer.businessName || customerName}`;
    const adminText = `
========================================
NEW TAPPY NFC GOOGLE REVIEW ORDER
========================================
Order ID: #${orderId}
Firestore Document ID: ${orderDocId}
Date: ${order.createdAt || new Date().toISOString()}
Payment Method: ${paymentMethod}
Total: ₱${total.toLocaleString()} (Subtotal: ₱${subtotal.toLocaleString()}, Shipping: ₱${shipping.toLocaleString()})

CUSTOMER INFORMATION:
----------------------------------------
Name: ${customerName}
Email: ${customerEmail || "Not provided"}
Phone: ${customer.phone || "Not provided"}
Address: ${customer.address || ""}, ${customer.city || ""} ${customer.postalCode || ""}

NFC ENCODING DETAILS:
----------------------------------------
Business Name: ${customer.businessName || "N/A"}
Google Review Link / Place: ${customer.googleReviewUrlOrPlace || "Pending Review Link"}
Special Notes: ${customer.notes || "None"}

ITEMS ORDERED:
----------------------------------------
${itemsSummary}

COURIER & TRACKING:
----------------------------------------
Courier: ${order.courier || "J&T Express Philippines"}
Waybill / Tracking: ${order.trackingNumber || `JT-PH-${orderId.replace("TR-", "")}`}
Live Tracking URL: ${trackingUrl}
    `;

    try {
      await transporter.sendMail({
        from: sender,
        to: ADMIN_EMAIL,
        subject: adminSubject,
        text: adminText,
      });
      console.log(`[CLOUD FUNCTION] Admin notification delivered to ${ADMIN_EMAIL} for Order #${orderId}`);
    } catch (adminErr) {
      console.error(`[CLOUD FUNCTION ERROR] Failed to send admin email to ${ADMIN_EMAIL}:`, adminErr);
    }

    // ========================================================
    // 2. Send Automated Confirmation to Customer
    // ========================================================
    if (customerEmail && customerEmail.includes("@")) {
      const customerSubject = `✅ Order Confirmed: #${orderId} - Your TAPPY NFC Stand is Being Programmed!`;
      const customerText = `
Hi ${customerName},

Thank you for your order with TAPPY NFC! We have received your order and our hardware team is queuing your NFC microchip for pre-programming and quality testing.

ORDER SUMMARY:
----------------------------------------
Order ID: #${orderId}
Date: ${order.createdAt || new Date().toLocaleDateString()}
Payment Method: ${paymentMethod}
Total Paid: ₱${total.toLocaleString()}

ITEMS:
----------------------------------------
${itemsSummary}

SHIPPING ADDRESS:
----------------------------------------
${customerName}
${customer.address || ""}
${customer.city || ""}, ${customer.province || ""} ${customer.postalCode || ""}
Phone: ${customer.phone || ""}

TRACK YOUR ORDER LIVE:
----------------------------------------
You can monitor your live order stage, chip encoding progress, and courier waybill anytime here:
${trackingUrl}

If you have any questions or need to modify your Google Review URL, reply directly to this email or chat with our team on WhatsApp / Viber at 0976 442 1242.

Best regards,
The TAPPY NFC Philippines Team
    `;

      try {
        await transporter.sendMail({
          from: sender,
          to: customerEmail,
          subject: customerSubject,
          text: customerText,
        });
        console.log(`[CLOUD FUNCTION] Customer confirmation delivered to ${customerEmail} for Order #${orderId}`);
      } catch (custErr) {
        console.error(`[CLOUD FUNCTION ERROR] Failed to send customer email to ${customerEmail}:`, custErr);
      }
    } else {
      console.log(`[CLOUD FUNCTION] No valid customer email provided for Order #${orderId}`);
    }

    // Update the Firestore document to mark notification sent
    try {
      await snapshot.ref.update({
        adminNotificationSentTo: ADMIN_EMAIL,
        customerConfirmationSentTo: customerEmail || null,
        cloudFunctionNotifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (updateErr) {
      console.warn("Could not update notification flag on order doc:", updateErr);
    }
  }
);
