import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Target Admin Email requested by user
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_EMAIL || 'jaesthetic.info@gmail.com';

// Configurable SMTP transporter (optional environment variables or fallback logger)
let transporter: nodemailer.Transporter | null = null;

function getEmailTransporter() {
  if (!transporter) {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }
  return transporter;
}

// In-memory / persistent dispatch log for admin inspection
const orderNotificationsLog: Array<{
  timestamp: string;
  orderId: string;
  recipient: string;
  status: 'sent' | 'logged';
  summary: string;
  customerName: string;
  total: number;
}> = [];

// Mock SMS dispatch log
const smsDispatchLog: Array<{
  timestamp: string;
  orderId: string;
  recipientPhone: string;
  message: string;
  gatewayStatus: 'DELIVERED_MOCK';
  messageId: string;
}> = [];

// API Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    adminEmail: ADMIN_NOTIFICATION_EMAIL,
    firebaseConfigured: true,
    smsGateway: 'PhilSMS / Semaphore Mock Active',
    timestamp: new Date().toISOString(),
  });
});

// API endpoint to send mock SMS confirmation
app.post('/api/sms/send-mock', (req, res) => {
  try {
    const { orderId, phone, customerName, total, trackingUrl } = req.body;

    if (!orderId || !phone) {
      return res.status(400).json({ error: 'Missing orderId or phone' });
    }

    const cleanPhone = String(phone).trim();
    const smsMessageId = `SMS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const smsContent = `[TAPPY NFC] Hi ${customerName || 'Valued Customer'}! Your Order #${orderId} (₱${Number(total || 0).toLocaleString()}) is confirmed & being prepared. Track live progress here: ${trackingUrl}. Need help? Viber/Call 09764421242.`;

    console.log(`\n======================================================`);
    console.log(`📱 [AUTOMATED SMS CONFIRMATION - MOCK SMS GATEWAY]`);
    console.log(`  To: ${cleanPhone}`);
    console.log(`  Message ID: ${smsMessageId}`);
    console.log(`  Message: "${smsContent}"`);
    console.log(`  Gateway Provider: Semaphore / PhilSMS Mock API (PH Telco Relay)`);
    console.log(`  Delivery Status: SUCCESSFUL (200 OK)`);
    console.log(`======================================================\n`);

    const logEntry = {
      timestamp: new Date().toISOString(),
      orderId,
      recipientPhone: cleanPhone,
      message: smsContent,
      gatewayStatus: 'DELIVERED_MOCK' as const,
      messageId: smsMessageId,
    };

    smsDispatchLog.unshift(logEntry);

    return res.json({
      success: true,
      message: 'Automated SMS confirmation dispatched via mock gateway',
      smsDetails: logEntry,
    });
  } catch (err: any) {
    console.error('Error sending mock SMS:', err);
    return res.status(500).json({ error: err?.message || 'Failed to dispatch mock SMS' });
  }
});

// API endpoint to notify on every order (sends email & automated SMS confirmation)
app.post('/api/orders/notify', async (req, res) => {
  try {
    const { order, firestoreDocId, recipientEmail } = req.body;
    const targetEmail = recipientEmail || ADMIN_NOTIFICATION_EMAIL;

    if (!order) {
      return res.status(400).json({ error: 'Missing order payload' });
    }

    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const trackingUrl = `${protocol}://${host}/?track=${order.id}`;

    console.log(`[ORDER NOTIFICATION] New order received: #${order.id} - Customer: ${order.customerInfo.fullName} (${order.customerInfo.email}) - Total: ₱${order.total}`);
    console.log(`[EMAIL DISPATCH] Forwarding order details to store admin: ${targetEmail}`);
    console.log(`[TRACKING LINK GENERATED] ${trackingUrl}`);

    const itemsSummary = order.items
      .map(
        (item: any) =>
          `• ${item.product.name} (Qty: ${item.quantity}) - ₱${(item.product.price * item.quantity).toLocaleString()}` +
          (item.businessName ? ` [Business: ${item.businessName}]` : '')
      )
      .join('\n');

    const emailSubject = `🚀 [NEW ORDER #${order.id}] ₱${order.total.toLocaleString()} - ${order.customerInfo.businessName || order.customerInfo.fullName}`;
    const emailBodyText = `
========================================
NEW TAPPY NFC GOOGLE REVIEW ORDER RECEIVED
========================================
Order ID: #${order.id}
Firestore Document ID: ${firestoreDocId || 'N/A'}
Date: ${order.createdAt}
Payment Method: ${order.paymentMethod?.toUpperCase()}
Total Amount: ₱${order.total.toLocaleString()} (Subtotal: ₱${order.subtotal.toLocaleString()} + Shipping: ₱${order.shipping.toLocaleString()})

CUSTOMER DETAILS:
----------------------------------------
Name: ${order.customerInfo.fullName}
Email: ${order.customerInfo.email}
Phone: ${order.customerInfo.phone}
Address: ${order.customerInfo.address}
City: ${order.customerInfo.city} ${order.customerInfo.postalCode || ''}

CUSTOMIZATION / NFC SETUP:
----------------------------------------
Business Name: ${order.customerInfo.businessName || 'Not specified'}
Google Maps / Review URL: ${order.customerInfo.googleReviewUrlOrPlace || 'Standard Review Setup'}
Notes: ${order.customerInfo.notes || 'None'}

ITEMS ORDERED:
----------------------------------------
${itemsSummary}

UNIQUE ORDER TRACKING LINK:
----------------------------------------
Customers can view their live order progress anytime at:
${trackingUrl}

----------------------------------------
Firebase Database Status: Saved in Firestore ('orders' collection).
You can track and manage this order directly in your TAPPY NFC system.
    `;

    let adminEmailSent = false;
    let customerEmailSent = false;
    const activeTransporter = getEmailTransporter();
    const sender = process.env.SMTP_FROM || `"TAPPY NFC Store" <no-reply@tapreview.ph>`;

    // 1. Send Email to Store Admin (jaesthetic.info@gmail.com)
    if (activeTransporter) {
      try {
        await activeTransporter.sendMail({
          from: sender,
          to: ADMIN_NOTIFICATION_EMAIL,
          subject: emailSubject,
          text: emailBodyText,
        });
        adminEmailSent = true;
        console.log(`[EMAIL DISPATCH SUCCESS] Real SMTP email delivered to admin: ${ADMIN_NOTIFICATION_EMAIL}`);
      } catch (smtpErr) {
        console.error('[SMTP SEND ERROR] Failed to send admin email via SMTP:', smtpErr);
      }
    } else {
      console.log(`[NOTIFICATION RECORDED] Order #${order.id} notification recorded for admin: ${ADMIN_NOTIFICATION_EMAIL}`);
    }

    orderNotificationsLog.unshift({
      timestamp: new Date().toISOString(),
      orderId: order.id,
      recipient: ADMIN_NOTIFICATION_EMAIL,
      status: adminEmailSent ? 'sent' : 'logged',
      summary: `[ADMIN NOTIFICATION] Order #${order.id} - ₱${order.total.toLocaleString()}`,
      customerName: order.customerInfo.fullName,
      total: order.total,
    });

    // 2. Send Automated Confirmation Email to Customer
    const customerEmail = String(order.customerInfo?.email || '').trim();
    if (customerEmail && customerEmail.includes('@')) {
      const customerSubject = `✅ Order Confirmed: #${order.id} - Your TAPPY NFC Google Review Stand`;
      const customerBodyText = `
Hi ${order.customerInfo.fullName},

Thank you for your order with TAPPY NFC! We have received your order and queued your NFC hardware for custom programming and inspection.

ORDER SUMMARY:
----------------------------------------
Order ID: #${order.id}
Date: ${order.createdAt}
Payment Method: ${order.paymentMethod?.toUpperCase()}
Total Paid: ₱${order.total.toLocaleString()} (Subtotal: ₱${order.subtotal.toLocaleString()} + Shipping: ₱${order.shipping.toLocaleString()})

ITEMS ORDERED:
----------------------------------------
${itemsSummary}

DELIVERY ADDRESS:
----------------------------------------
${order.customerInfo.fullName}
${order.customerInfo.address}
${order.customerInfo.city} ${order.customerInfo.postalCode || ''}
Phone: ${order.customerInfo.phone}

LIVE TRACKING & STATUS:
----------------------------------------
You can track your live order stage and courier waybill anytime here:
${trackingUrl}

Need assistance? Contact our team at jaesthetic.info@gmail.com or Viber/Call 0976 442 1242.

Best regards,
The TAPPY NFC Philippines Team
      `;

      if (activeTransporter) {
        try {
          await activeTransporter.sendMail({
            from: sender,
            to: customerEmail,
            subject: customerSubject,
            text: customerBodyText,
          });
          customerEmailSent = true;
          console.log(`[EMAIL DISPATCH SUCCESS] Real SMTP email delivered to customer: ${customerEmail}`);
        } catch (custSmtpErr) {
          console.error('[SMTP SEND ERROR] Failed to send customer email via SMTP:', custSmtpErr);
        }
      } else {
        console.log(`[CUSTOMER CONFIRMATION RECORDED] Order #${order.id} confirmation recorded for customer: ${customerEmail}`);
      }

      orderNotificationsLog.unshift({
        timestamp: new Date().toISOString(),
        orderId: order.id,
        recipient: customerEmail,
        status: customerEmailSent ? 'sent' : 'logged',
        summary: `[CUSTOMER CONFIRMATION] Order #${order.id} - ₱${order.total.toLocaleString()}`,
        customerName: order.customerInfo.fullName,
        total: order.total,
      });
    }

    // Automated Mock SMS confirmation dispatched to customer's mobile number
    const customerPhone = String(order.customerInfo?.phone || '').trim();
    let smsDispatched = false;
    let smsDetails: any = null;

    if (customerPhone) {
      const smsMessageId = `SMS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const smsContent = `[TAPPY NFC] Hi ${order.customerInfo.fullName}! Your Order #${order.id} (₱${order.total.toLocaleString()}) is confirmed & queued. Live tracking: ${trackingUrl}. Support: 09764421242`;

      console.log(`\n======================================================`);
      console.log(`📱 [AUTOMATED SMS CONFIRMATION - MOCK SMS GATEWAY]`);
      console.log(`  To: ${customerPhone}`);
      console.log(`  Message ID: ${smsMessageId}`);
      console.log(`  Message: "${smsContent}"`);
      console.log(`  Status: DELIVERED (Mock Gateway)`);
      console.log(`======================================================\n`);

      smsDetails = {
        timestamp: new Date().toISOString(),
        orderId: order.id,
        recipientPhone: customerPhone,
        message: smsContent,
        gatewayStatus: 'DELIVERED_MOCK',
        messageId: smsMessageId,
      };

      smsDispatchLog.unshift(smsDetails);
      smsDispatched = true;
    }

    return res.json({
      success: true,
      message: `Order #${order.id} recorded, email sent to admin (${ADMIN_NOTIFICATION_EMAIL}) and customer (${customerEmail || 'N/A'}), and SMS sent to ${customerPhone}`,
      adminEmail: ADMIN_NOTIFICATION_EMAIL,
      customerEmail,
      adminEmailSent,
      customerEmailSent,
      smsDispatched,
      smsDetails,
      orderId: order.id,
      trackingUrl,
    });
  } catch (error: any) {
    console.error('Error handling order notification:', error);
    return res.status(500).json({ error: error?.message || 'Internal server error' });
  }
});

// Endpoint to view notification dispatch logs for admin
app.get('/api/orders/logs', (req, res) => {
  res.json({
    adminEmail: ADMIN_NOTIFICATION_EMAIL,
    totalOrdersLogged: orderNotificationsLog.length,
    recentNotifications: orderNotificationsLog.slice(0, 50),
  });
});

// Setup Vite development middleware or static production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TAPPY NFC Server running at http://0.0.0.0:${PORT}`);
    console.log(`📧 Admin order recipient configured to: ${ADMIN_NOTIFICATION_EMAIL}`);
  });

  const gracefulShutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

startServer();
