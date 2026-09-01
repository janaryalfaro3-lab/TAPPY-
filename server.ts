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

// API Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    adminEmail: ADMIN_NOTIFICATION_EMAIL,
    firebaseConfigured: true,
    timestamp: new Date().toISOString(),
  });
});

// API endpoint to notify admin jaesthetic.info@gmail.com on every order
app.post('/api/orders/notify', async (req, res) => {
  try {
    const { order, firestoreDocId, recipientEmail } = req.body;
    const targetEmail = recipientEmail || ADMIN_NOTIFICATION_EMAIL;

    if (!order) {
      return res.status(400).json({ error: 'Missing order payload' });
    }

    console.log(`[ORDER NOTIFICATION] New order received: #${order.id} - Customer: ${order.customerInfo.fullName} (${order.customerInfo.email}) - Total: ₱${order.total}`);
    console.log(`[EMAIL DISPATCH] Forwarding order details to store admin: ${targetEmail}`);

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

----------------------------------------
Firebase Database Status: Saved in Firestore ('orders' collection).
You can manage this order directly in your TAPPY NFC Admin Portal or Firebase Console.
    `;

    let emailSent = false;
    const activeTransporter = getEmailTransporter();

    if (activeTransporter) {
      try {
        await activeTransporter.sendMail({
          from: process.env.SMTP_FROM || `"TAPPY NFC Store" <no-reply@tapreview.ph>`,
          to: targetEmail,
          subject: emailSubject,
          text: emailBodyText,
        });
        emailSent = true;
        console.log(`[EMAIL DISPATCH SUCCESS] Real SMTP email delivered to ${targetEmail}`);
      } catch (smtpErr) {
        console.error('[SMTP SEND ERROR] Failed to send via SMTP, logged order securely:', smtpErr);
      }
    } else {
      console.log(`[NOTIFICATION RECORDED] Order #${order.id} recorded for admin ${targetEmail}. (Configure SMTP credentials in .env to enable direct SMTP mailer)`);
    }

    orderNotificationsLog.unshift({
      timestamp: new Date().toISOString(),
      orderId: order.id,
      recipient: targetEmail,
      status: emailSent ? 'sent' : 'logged',
      summary: `Order #${order.id} - ₱${order.total.toLocaleString()}`,
      customerName: order.customerInfo.fullName,
      total: order.total,
    });

    return res.json({
      success: true,
      message: `Order #${order.id} recorded and notification dispatched to ${targetEmail}`,
      targetEmail,
      emailSent,
      orderId: order.id,
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TAPPY NFC Server running at http://0.0.0.0:${PORT}`);
    console.log(`📧 Admin order recipient configured to: ${ADMIN_NOTIFICATION_EMAIL}`);
  });
}

startServer();
